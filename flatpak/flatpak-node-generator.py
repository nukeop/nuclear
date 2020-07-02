#!/usr/bin/env python3

__license__ = 'MIT'

from typing import *
# Explictly import these.
from typing import cast, IO

from pathlib import Path
from distutils.version import StrictVersion

import argparse
import asyncio
import base64
import binascii
import collections
import contextlib
import hashlib
import json
import os
import re
import shlex
import shutil
import sys
import tempfile
import textwrap
import types
import urllib.parse
import urllib.request

DEFAULT_PART_SIZE = 4096


class Cache:
    instance: 'Cache'

    @classmethod
    def get_working_instance_if(cls, condition: bool) -> 'Cache':
        return cls.instance if condition else NullCache()

    class BucketReader:
        def read_parts(self, size: int = DEFAULT_PART_SIZE) -> Iterator[bytes]:
            raise NotImplementedError

        def read_all(self) -> bytes:
            raise NotImplementedError

        def close(self) -> None:
            raise NotImplementedError

        def __enter__(self) -> 'Cache.BucketReader':
            return self

        def __exit__(self, exc_type: Optional[Type[BaseException]],
                     exc_value: Optional[BaseException],
                     traceback: Optional[types.TracebackType]):
            self.close()

    class BucketWriter:
        def write(self, data: bytes) -> None:
            raise NotImplementedError

        def cancel(self) -> None:
            raise NotImplementedError

        def seal(self) -> None:
            raise NotImplementedError

        def __enter__(self) -> 'Cache.BucketWriter':
            return self

        def __exit__(self, exc_type: Optional[Type[BaseException]],
                     exc_value: Optional[BaseException],
                     traceback: Optional[types.TracebackType]):
            if traceback is None:
                self.seal()
            else:
                self.cancel()

    class BucketRef:
        def __init__(self, key: str) -> None:
            self.key = key

        def open_read(self) -> Optional['Cache.BucketReader']:
            raise NotImplementedError

        def open_write(self) -> 'Cache.BucketWriter':
            raise NotImplementedError

    def get(self, key: str) -> BucketRef:
        raise NotImplementedError


class NullCache(Cache):
    class NullBucketWriter(Cache.BucketWriter):
        def write(self, data: bytes) -> None:
            pass

        def cancel(self) -> None:
            pass

        def seal(self) -> None:
            pass

    class NullBucketRef(Cache.BucketRef):
        def __init__(self, key: str) -> None:
            super().__init__(key)

        def open_read(self) -> Optional[Cache.BucketReader]:
            return None

        def open_write(self) -> Cache.BucketWriter:
            return NullCache.NullBucketWriter()

    def get(self, key: str) -> Cache.BucketRef:
        return NullCache.NullBucketRef(key)


class FilesystemBasedCache(Cache):
    _SUBDIR = 'flatpak-node-generator'
    _KEY_CHAR_ESCAPE_RE = re.compile(r'[^A-Za-z0-9._\-]')

    @staticmethod
    def _escape_key(key: str) -> str:
        return FilesystemBasedCache._KEY_CHAR_ESCAPE_RE.sub(
            lambda m: f'_{ord(m.group()):02X}', key)

    class FilesystemBucketReader(Cache.BucketReader):
        def __init__(self, file: IO[bytes]) -> None:
            self.file = file

        def close(self) -> None:
            self.file.close()

        def read_parts(self, size: int = DEFAULT_PART_SIZE) -> Iterator[bytes]:
            while True:
                data = self.file.read(size)
                if not data:
                    break

                yield data

        def read_all(self) -> bytes:
            return self.file.read()

    class FilesystemBucketWriter(Cache.BucketWriter):
        def __init__(self, file: IO[bytes], temp: Path, target: Path) -> None:
            self.file = file
            self.temp = temp
            self.target = target

        def write(self, data: bytes) -> None:
            self.file.write(data)

        def cancel(self) -> None:
            self.file.close()
            self.temp.unlink()

        def seal(self) -> None:
            self.file.close()
            self.temp.rename(self.target)

    class FilesystemBucketRef(Cache.BucketRef):
        def __init__(self, key: str, cache_root: Path) -> None:
            super().__init__(key)
            self._cache_root = cache_root

            self._cache_path = self._cache_root / FilesystemBasedCache._escape_key(key)

        def open_read(self) -> Optional[Cache.BucketReader]:
            try:
                fp = self._cache_path.open('rb')
            except FileNotFoundError:
                return None
            else:
                return FilesystemBasedCache.FilesystemBucketReader(fp)

        def open_write(self) -> Cache.BucketWriter:
            target = self._cache_path
            if not target.parent.exists():
                target.parent.mkdir(exist_ok=True, parents=True)

            fd, temp = tempfile.mkstemp(dir=self._cache_root, prefix='__temp__')
            return FilesystemBasedCache.FilesystemBucketWriter(os.fdopen(fd, 'wb'),
                                                               Path(temp), target)

    @property
    def _cache_root(self) -> Path:
        xdg_cache_home = os.environ.get('XDG_CACHE_HOME', os.path.expanduser('~/.cache'))
        return Path(xdg_cache_home) / self._SUBDIR

    def get(self, key: str) -> Cache.BucketRef:
        return FilesystemBasedCache.FilesystemBucketRef(key, self._cache_root)


Cache.instance = NullCache()


class Requests:
    instance: 'Requests'

    DEFAULT_RETRIES = 5
    retries: ClassVar[int] = DEFAULT_RETRIES

    @property
    def is_async(self) -> bool:
        raise NotImplementedError

    def __get_cache_bucket(self, cachable: bool, url: str) -> Cache.BucketRef:
        return Cache.get_working_instance_if(cachable).get(f'requests:{url}')

    async def _read_parts(self,
                          url: str,
                          size: int = DEFAULT_PART_SIZE) -> AsyncIterator[bytes]:
        raise NotImplementedError
        yield b''  # Silence mypy.

    async def _read_all(self, url: str) -> bytes:
        raise NotImplementedError

    async def read_parts(self,
                         url: str,
                         *,
                         cachable: bool,
                         size: int = DEFAULT_PART_SIZE) -> AsyncIterator[bytes]:
        bucket = self.__get_cache_bucket(cachable, url)

        bucket_reader = bucket.open_read()
        if bucket_reader is not None:
            for part in bucket_reader.read_parts(size):
                yield part

            return

        for i in range(1, Requests.retries + 1):
            try:
                with bucket.open_write() as bucket_writer:
                    async for part in self._read_parts(url, size):
                        bucket_writer.write(part)
                        yield part

                return
            except Exception:
                if i == Requests.retries:
                    raise

    async def read_all(self, url: str, *, cachable: bool = False) -> bytes:
        bucket = self.__get_cache_bucket(cachable, url)

        bucket_reader = bucket.open_read()
        if bucket_reader is not None:
            return bucket_reader.read_all()

        for i in range(1, Requests.retries + 1):
            try:
                with bucket.open_write() as bucket_writer:
                    data = await self._read_all(url)
                    bucket_writer.write(data)
                    return data
            except Exception:
                if i == Requests.retries:
                    raise

        assert False


class UrllibRequests(Requests):
    @property
    def is_async(self) -> bool:
        return False

    async def _read_parts(self,
                          url: str,
                          size: int = DEFAULT_PART_SIZE) -> AsyncIterator[bytes]:
        with urllib.request.urlopen(url) as response:
            while True:
                data = response.read(size)
                if not data:
                    return

                yield data

    async def _read_all(self, url: str) -> bytes:
        with urllib.request.urlopen(url) as response:
            return cast(bytes, response.read())


class StubRequests(Requests):
    @property
    def is_async(self) -> bool:
        return True

    async def _read_parts(self,
                          url: str,
                          size: int = DEFAULT_PART_SIZE) -> AsyncIterator[bytes]:
        yield b''

    async def _read_all(self, url: str) -> bytes:
        return b''


Requests.instance = UrllibRequests()

try:
    import aiohttp

    class AsyncRequests(Requests):
        @property
        def is_async(self) -> bool:
            return True

        @contextlib.asynccontextmanager
        async def _open_stream(self, url: str) -> AsyncIterator[aiohttp.StreamReader]:
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    yield response.content

        async def _read_parts(self,
                              url: str,
                              size: int = DEFAULT_PART_SIZE) -> AsyncIterator[bytes]:
            async with self._open_stream(url) as stream:
                while True:
                    data = await stream.read(size)
                    if not data:
                        return

                    yield data

        async def _read_all(self, url: str) -> bytes:
            async with self._open_stream(url) as stream:
                return await stream.read()

    Requests.instance = AsyncRequests()

except ImportError:
    pass


class CachedRequests(Requests):
    pass


class Integrity(NamedTuple):
    algorithm: str
    digest: str

    @staticmethod
    def parse(value: str) -> 'Integrity':
        algorithm, encoded_digest = value.split('-', 1)
        assert algorithm.startswith('sha'), algorithm
        digest = binascii.hexlify(base64.b64decode(encoded_digest)).decode()

        return Integrity(algorithm, digest)

    @staticmethod
    def from_sha1(sha1: str) -> 'Integrity':
        assert len(sha1) == 40, f'Invalid length of sha1: {sha1}'
        return Integrity('sha1', sha1)

    @staticmethod
    def generate(data: AnyStr, *, algorithm: str = 'sha256') -> 'Integrity':
        builder = IntegrityBuilder(algorithm)
        builder.update(data)
        return builder.build()

    @staticmethod
    def from_json_object(data: Any) -> 'Integrity':
        return Integrity(algorithm=data['algorithm'], digest=data['digest'])

    def to_json_object(self) -> Any:
        return {'algorithm': self.algorithm, 'digest': self.digest}

    def to_base64(self) -> str:
        return base64.b64encode(binascii.unhexlify(self.digest)).decode()


class IntegrityBuilder:
    def __init__(self, algorithm: str = 'sha256') -> None:
        self.algorithm = algorithm
        self._hasher = hashlib.new(algorithm)

    def update(self, data: AnyStr) -> None:
        data_bytes: bytes
        if isinstance(data, str):
            data_bytes = data.encode()
        else:
            data_bytes = data
        self._hasher.update(data_bytes)

    def build(self) -> Integrity:
        return Integrity(algorithm=self.algorithm, digest=self._hasher.hexdigest())


class RemoteUrlMetadata(NamedTuple):
    integrity: Integrity
    size: int

    @staticmethod
    def __get_cache_bucket(cachable: bool, kind: str, url: str) -> Cache.BucketRef:
        return Cache.get_working_instance_if(cachable).get(
            f'remote-url-metadata:{kind}:{url}')

    @staticmethod
    def from_json_object(data: Any) -> 'RemoteUrlMetadata':
        return RemoteUrlMetadata(integrity=Integrity.from_json_object(data['integrity']),
                                 size=data['size'])

    @classmethod
    async def get(cls,
                  url: str,
                  *,
                  cachable: bool,
                  integrity_algorithm: str = 'sha256') -> 'RemoteUrlMetadata':
        bucket = cls.__get_cache_bucket(cachable, 'full', url)

        bucket_reader = bucket.open_read()
        if bucket_reader is not None:
            data = json.loads(bucket_reader.read_all())
            return RemoteUrlMetadata.from_json_object(data)

        builder = IntegrityBuilder(integrity_algorithm)
        size = 0

        async for part in Requests.instance.read_parts(url, cachable=False):
            builder.update(part)
            size += len(part)

        metadata = RemoteUrlMetadata(integrity=builder.build(), size=size)

        with bucket.open_write() as bucket_writer:
            bucket_writer.write(json.dumps(metadata.to_json_object()).encode('ascii'))

        return metadata

    @classmethod
    async def get_size(cls, url: str, *, cachable: bool) -> int:
        bucket = cls.__get_cache_bucket(cachable, 'size', url)

        bucket_reader = bucket.open_read()
        if bucket_reader is not None:
            return int(bucket_reader.read_all())

        size = 0
        async for part in Requests.instance.read_parts(url, cachable=False):
            size += len(part)

        with bucket.open_write() as bucket_writer:
            bucket_writer.write(str(size).encode('ascii'))

        return size

    def to_json_object(self) -> Any:
        return {'integrity': self.integrity.to_json_object(), 'size': self.size}


class ResolvedSource(NamedTuple):
    resolved: str
    integrity: Optional[Integrity]

    async def retrieve_integrity(self) -> Integrity:
        if self.integrity is not None:
            return self.integrity
        else:
            url = self.resolved
            assert url is not None, 'registry source has no resolved URL'
            metadata = await RemoteUrlMetadata.get(url, cachable=True)
            return metadata.integrity


class UnresolvedRegistrySource:
    pass


class GitSource(NamedTuple):
    original: str
    url: str
    commit: str
    from_: str


PackageSource = Union[ResolvedSource, UnresolvedRegistrySource, GitSource]


class Package(NamedTuple):
    name: str
    version: str
    source: PackageSource
    lockfile: Path


class ManifestGenerator(contextlib.AbstractContextManager):
    MAX_GITHUB_SIZE = 49 * 1000 * 1000
    JSON_INDENT = 4

    def __init__(self) -> None:
        # Store the dicts as a set of tuples, then rebuild the dict when returning it.
        # That way, we ensure uniqueness.
        self._sources: Set[Tuple[Tuple[str, Any], ...]] = set()
        self._commands: List[str] = []

    def __exit__(self, *_: Any) -> None:
        self._finalize()

    @property
    def data_root(self) -> Path:
        return Path('flatpak-node')

    @property
    def tmp_root(self) -> Path:
        return self.data_root / 'tmp'

    @property
    def source_count(self) -> int:
        return len(self._sources)

    def ordered_sources(self) -> Iterator[Dict]:
        return map(dict, sorted(self._sources))  # type: ignore

    def split_sources(self) -> Iterator[List[Dict]]:
        BASE_CURRENT_SIZE = len('[\n]')
        current_size = BASE_CURRENT_SIZE
        current: List[Dict] = []

        for source in self.ordered_sources():
            # Generate one source by itself, then check the length without the closing and
            # opening brackets.
            source_json = json.dumps([source], indent=ManifestGenerator.JSON_INDENT)
            source_json_len = len('\n'.join(source_json.splitlines()[1:-1]))
            if current_size + source_json_len >= ManifestGenerator.MAX_GITHUB_SIZE:
                yield current
                current = []
                current_size = BASE_CURRENT_SIZE
            current.append(source)
            current_size += source_json_len

        if current:
            yield current

    def _add_source(self, source: Dict[str, Any]) -> None:
        self._sources.add(tuple(source.items()))

    def _add_source_with_destination(self,
                                     source: Dict[str, Any],
                                     destination: Optional[Path],
                                     *,
                                     is_dir: bool,
                                     only_arches: Optional[List[str]] = None) -> None:
        if destination is not None:
            if is_dir:
                source['dest'] = str(destination)
            else:
                source['dest-filename'] = destination.name
                if len(destination.parts) > 1:
                    source['dest'] = str(destination.parent)

        if only_arches:
            source['only-arches'] = tuple(only_arches)

        self._add_source(source)

    def add_url_source(self,
                       url: str,
                       integrity: Integrity,
                       destination: Optional[Path] = None,
                       *,
                       only_arches: Optional[List[str]] = None) -> None:
        source: Dict[str, Any] = {
            'type': 'file',
            'url': url,
            integrity.algorithm: integrity.digest
        }
        self._add_source_with_destination(source,
                                          destination,
                                          is_dir=False,
                                          only_arches=only_arches)

    def add_archive_source(self,
                           url: str,
                           integrity: Integrity,
                           destination: Optional[Path] = None,
                           only_arches: Optional[List[str]] = None,
                           strip_components: int = 1) -> None:
        source: Dict[str, Any] = {
            'type': 'archive',
            'url': url,
            'strip-components': strip_components,
            integrity.algorithm: integrity.digest
        }
        self._add_source_with_destination(source,
                                          destination,
                                          is_dir=True,
                                          only_arches=only_arches)

    def add_data_source(self, data: AnyStr, destination: Path) -> None:
        source = {'type': 'file', 'url': 'data:' + urllib.parse.quote(data)}
        self._add_source_with_destination(source, destination, is_dir=False)

    def add_git_source(self,
                       url: str,
                       commit: str,
                       destination: Optional[Path] = None) -> None:
        source = {'type': 'git', 'url': url, 'commit': commit}
        self._add_source_with_destination(source, destination, is_dir=True)

    def add_script_source(self, commands: List[str], destination: Path) -> None:
        source = {'type': 'script', 'commands': tuple(commands)}
        self._add_source_with_destination(source, destination, is_dir=False)

    def add_command(self, command: str) -> None:
        self._commands.append(command)

    def _finalize(self) -> None:
        if self._commands:
            self._add_source({'type': 'shell', 'commands': tuple(self._commands)})


class LockfileProvider:
    def process_lockfile(self, lockfile: Path) -> Iterator[Package]:
        raise NotImplementedError()


class ModuleProvider(contextlib.AbstractContextManager):
    async def generate_package(self, package: Package) -> None:
        raise NotImplementedError()


class ElectronBinaryManager:
    class Arch(NamedTuple):
        electron: str
        flatpak: str

    class Binary(NamedTuple):
        filename: str
        url: str
        integrity: Integrity

        arch: Optional['ElectronBinaryManager.Arch'] = None

    ELECTRON_ARCHES_TO_FLATPAK = {
        'ia32': 'i386',
        'x64': 'x86_64',
        'armv7l': 'arm',
        'arm64': 'aarch64',
    }

    INTEGRITY_BASE_FILENAME = 'SHASUMS256.txt'

    def __init__(self, version: str, base_url: str, integrities: Dict[str,
                                                                      Integrity]) -> None:
        self.version = version
        self.base_url = base_url
        self.integrities = integrities

    def child_url(self, child: str) -> str:
        return f'{self.base_url}/{child}'

    def find_binaries(self, binary: str) -> Iterator['ElectronBinaryManager.Binary']:
        for electron_arch, flatpak_arch in self.ELECTRON_ARCHES_TO_FLATPAK.items():
            binary_filename = f'{binary}-v{self.version}-linux-{electron_arch}.zip'
            binary_url = self.child_url(binary_filename)

            arch = ElectronBinaryManager.Arch(electron=electron_arch,
                                              flatpak=flatpak_arch)
            yield ElectronBinaryManager.Binary(
                filename=binary_filename,
                url=binary_url,
                integrity=self.integrities[binary_filename],
                arch=arch)

    @property
    def integrity_file(self) -> 'ElectronBinaryManager.Binary':
        return ElectronBinaryManager.Binary(
            filename=f'SHASUMS256.txt-{self.version}',
            url=self.child_url(self.INTEGRITY_BASE_FILENAME),
            integrity=self.integrities[self.INTEGRITY_BASE_FILENAME])

    @staticmethod
    async def for_version(version: str) -> 'ElectronBinaryManager':
        base_url = f'https://github.com/electron/electron/releases/download/v{version}'
        integrity_url = f'{base_url}/{ElectronBinaryManager.INTEGRITY_BASE_FILENAME}'
        integrity_data = (await Requests.instance.read_all(integrity_url,
                                                           cachable=True)).decode()

        integrities: Dict[str, Integrity] = {}
        for line in integrity_data.splitlines():
            digest, star_filename = line.split()
            filename = star_filename.strip('*')
            integrities[filename] = Integrity(algorithm='sha256', digest=digest)

        integrities[ElectronBinaryManager.INTEGRITY_BASE_FILENAME] = (
            Integrity.generate(integrity_data))

        return ElectronBinaryManager(version=version,
                                     base_url=base_url,
                                     integrities=integrities)


class SpecialSourceProvider:
    class Options(NamedTuple):
        node_chromedriver_from_electron: str
        electron_ffmpeg: str
        electron_node_headers: bool
        xdg_layout: bool

    def __init__(self, gen: ManifestGenerator, options: Options):
        self.gen = gen
        self.node_chromedriver_from_electron = options.node_chromedriver_from_electron
        self.electron_ffmpeg = options.electron_ffmpeg
        self.electron_node_headers = options.electron_node_headers
        self.xdg_layout = options.xdg_layout

    @property
    def electron_cache_dir(self) -> Path:
        if self.xdg_layout:
            return self.gen.data_root / 'cache' / 'electron'
        return self.gen.data_root / 'electron-cache'

    def _add_electron_cache_downloads(self,
                                      manager: ElectronBinaryManager,
                                      binary_name: str,
                                      *,
                                      add_integrities=True) -> None:
        electron_cache_dir = self.electron_cache_dir

        for binary in manager.find_binaries(binary_name):
            assert binary.arch is not None
            self.gen.add_url_source(binary.url,
                                    binary.integrity,
                                    electron_cache_dir / binary.filename,
                                    only_arches=[binary.arch.flatpak])

        if add_integrities:
            integrity_file = manager.integrity_file
            self.gen.add_url_source(integrity_file.url, integrity_file.integrity,
                                    electron_cache_dir / integrity_file.filename)

    async def _handle_electron(self, package: Package) -> None:
        manager = await ElectronBinaryManager.for_version(package.version)
        self._add_electron_cache_downloads(manager, 'electron')

        if self.electron_ffmpeg is not None:
            if self.electron_ffmpeg == 'archive':
                self._add_electron_cache_downloads(manager,
                                                   'ffmpeg',
                                                   add_integrities=False)
            elif self.electron_ffmpeg == 'lib':
                for binary in manager.find_binaries('ffmpeg'):
                    assert binary.arch is not None
                    self.gen.add_archive_source(binary.url,
                                                binary.integrity,
                                                destination=self.gen.data_root,
                                                only_arches=[binary.arch.flatpak])
            else:
                assert False, self.electron_ffmpeg

    def _handle_gulp_atom_electron(self, package: Package) -> None:
        # Versions after 1.22.0 use @electron/get and don't need this
        if StrictVersion(package.version) <= StrictVersion('1.22.0'):
            cache_path = self.gen.data_root / 'tmp' / 'gulp-electron-cache' / 'atom' / 'electron'
            self.gen.add_command(f'mkdir -p "{cache_path.parent}"')
            self.gen.add_command(f'ln -sfTr "{self.electron_cache_dir}" "{cache_path}"')

    async def _handle_electron_headers(self, package: Package) -> None:
        if self.xdg_layout:
            node_gyp_headers_dir = self.gen.data_root / 'cache' / 'node-gyp' / package.version
        else:
            node_gyp_headers_dir = self.gen.data_root / 'node-gyp' / 'electron-current'
        url = f'https://www.electronjs.org/headers/v{package.version}/node-v{package.version}-headers.tar.gz'
        metadata = await RemoteUrlMetadata.get(url, cachable=True)
        self.gen.add_archive_source(url,
                                    metadata.integrity,
                                    destination=node_gyp_headers_dir)
        if self.xdg_layout:
            install_version_data = "9"
            self.gen.add_data_source(install_version_data,
                                     destination=node_gyp_headers_dir / 'installVersion')

    async def _get_chromedriver_binary_version(self, package: Package) -> str:
        # Note: node-chromedriver seems to not have tagged all releases on GitHub, so
        # just use unpkg instead.
        url = f'https://unpkg.com/chromedriver@{package.version}/lib/chromedriver'
        js = await Requests.instance.read_all(url, cachable=True)
        # XXX: a tad ugly
        match = re.search(r"exports\.version = '([^']+)'", js.decode())
        assert match is not None, f'Failed to get ChromeDriver binary version from {url}'
        return match.group(1)

    async def _handle_electron_chromedriver(self, package: Package) -> None:
        manager = await ElectronBinaryManager.for_version(package.version)
        self._add_electron_cache_downloads(manager, 'chromedriver')

    async def _handle_node_chromedriver(self, package: Package) -> None:
        version = await self._get_chromedriver_binary_version(package)
        destination = self.gen.data_root / 'chromedriver'

        if self.node_chromedriver_from_electron is not None:
            manager = await ElectronBinaryManager.for_version(
                self.node_chromedriver_from_electron)

            for binary in manager.find_binaries('chromedriver'):
                assert binary.arch is not None
                self.gen.add_archive_source(binary.url,
                                            binary.integrity,
                                            destination=destination,
                                            only_arches=[binary.arch.flatpak])
        else:
            url = (f'https://chromedriver.storage.googleapis.com/{version}/'
                   'chromedriver_linux64.zip')
            metadata = await RemoteUrlMetadata.get(url, cachable=True)

            self.gen.add_archive_source(url,
                                        metadata.integrity,
                                        destination=destination,
                                        only_arches=['x86_64'])

    async def _handle_dugite_native(self, package: Package) -> None:
        dl_json_url = f'https://github.com/desktop/dugite/raw/v{package.version}/script/embedded-git.json'
        dl_json = json.loads(await Requests.instance.read_all(dl_json_url, cachable=True))
        dugite_arch_map = {
            'x86_64': 'linux-x64',
        }
        destdir = self.gen.data_root / 'tmp'
        for arch, dugite_arch in dugite_arch_map.items():
            url = dl_json[dugite_arch]['url']
            filename = dl_json[dugite_arch]['name']
            integrity = Integrity(algorithm='sha256',
                                  digest=dl_json[dugite_arch]['checksum'])

            self.gen.add_url_source(url,
                                    integrity,
                                    destination=destdir / filename,
                                    only_arches=[arch])

    async def _handle_ripgrep_prebuilt(self, package: Package) -> None:
        async def get_ripgrep_tag(version):
            url = f'https://github.com/microsoft/vscode-ripgrep/raw/v{version}/lib/postinstall.js'
            tag_re = re.compile(r"VERSION\s+=\s+'(v[\d.-]+)';")
            resp = await Requests.instance.read_all(url, cachable=True)
            match = tag_re.search(resp.decode())
            assert match is not None
            return match.group(1)

        tag = await get_ripgrep_tag(package.version)
        ripgrep_arch_map = {
            'x86_64': 'x86_64-unknown-linux-musl',
            'i386': 'i686-unknown-linux-musl',
            'arm': 'arm-unknown-linux-gnueabihf',
            'aarch64': 'aarch64-unknown-linux-gnu'
        }
        destdir = self.gen.data_root / 'tmp' / f'vscode-ripgrep-cache-{package.version}'
        for arch, ripgrep_arch in ripgrep_arch_map.items():
            filename = f'ripgrep-{tag}-{ripgrep_arch}.tar.gz'
            url = f'https://github.com/microsoft/ripgrep-prebuilt/releases/download/{tag}/{filename}'
            metadata = await RemoteUrlMetadata.get(url, cachable=True)
            self.gen.add_url_source(url,
                                    metadata.integrity,
                                    destination=destdir / filename,
                                    only_arches=[arch])

    async def _handle_playwright(self, package: Package) -> None:
        base_url = f'https://github.com/microsoft/playwright/raw/v{package.version}/'
        browsers_json_url = base_url + 'browsers.json'
        browsers_json = json.loads(await Requests.instance.read_all(browsers_json_url,
                                                                    cachable=True))
        dl_urls = {
            'chromium':
                'https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/%d/chrome-linux.zip',
            'firefox':
                'https://playwright.azureedge.net/builds/firefox/%s/firefox-linux.zip',
            'webkit':
                'https://playwright.azureedge.net/builds/webkit/%s/minibrowser-gtk-wpe.zip',
        }
        for browser in browsers_json['browsers']:
            name = browser['name']
            revision = browser['revision']
            dl_url = dl_urls[name] % (int(revision))
            metadata = await RemoteUrlMetadata.get(dl_url, cachable=True)
            destdir = self.gen.data_root / 'cache' / 'ms-playwright' / f'{name}-{revision}'
            self.gen.add_archive_source(dl_url,
                                        metadata.integrity,
                                        destination=destdir,
                                        strip_components=0)

    def _handle_electron_builder(self, package: Package) -> None:
        destination = self.gen.data_root / 'electron-builder-arch-args.sh'

        script = []
        script.append('case "$FLATPAK_ARCH" in')

        for electron_arch, flatpak_arch in (
                ElectronBinaryManager.ELECTRON_ARCHES_TO_FLATPAK.items()):
            script.append(f'"{flatpak_arch}")')
            script.append(f'  export ELECTRON_BUILDER_ARCH_ARGS="--{electron_arch}"')
            script.append('  ;;')

        script.append('esac')

        self.gen.add_script_source(script, destination)

    async def generate_special_sources(self, package: Package) -> None:
        if isinstance(Requests.instance, StubRequests):
            # This is going to crash and burn.
            return

        if package.name == 'electron':
            await self._handle_electron(package)
            if self.electron_node_headers or self.xdg_layout:
                await self._handle_electron_headers(package)
        elif package.name == 'electron-chromedriver':
            await self._handle_electron_chromedriver(package)
        elif package.name == 'chromedriver':
            await self._handle_node_chromedriver(package)
        elif package.name == 'electron-builder':
            self._handle_electron_builder(package)
        elif package.name == 'gulp-atom-electron':
            self._handle_gulp_atom_electron(package)
        elif package.name == 'dugite':
            await self._handle_dugite_native(package)
        elif package.name == 'vscode-ripgrep':
            await self._handle_ripgrep_prebuilt(package)
        elif package.name == 'playwright':
            await self._handle_playwright(package)


class NpmLockfileProvider(LockfileProvider):
    class Options(NamedTuple):
        no_devel: bool

    def __init__(self, options: Options):
        self.no_devel = options.no_devel

    def parse_git_source(self, version: str, from_: str) -> Optional[GitSource]:
        git_prefixes = {
            'github:': 'https://github.com/',
            'gitlab:': 'https://gitlab.com/',
            'bitbucket:': 'https://bitbucket.com/',
            'git:': 'git://',
            'git+http:': 'http:',
            'git+https:': 'https:',
        }

        assert version.count('#') == 1, version
        original, commit = version.split('#')

        url: Optional[str] = None

        for npm_prefix, url_prefix in git_prefixes.items():
            if original.startswith(npm_prefix):
                url = url_prefix + original[len(npm_prefix):]
                break
        else:
            return None

        return GitSource(original=original, url=url, commit=commit, from_=from_)

    def process_dependencies(self, lockfile: Path,
                             dependencies: Dict[str, Dict]) -> Iterator[Package]:
        for name, info in dependencies.items():
            if info.get('dev') and self.no_devel:
                continue
            elif info.get('bundled'):
                continue

            version: str = info['version']

            source: PackageSource
            if info.get('from'):
                git_source = self.parse_git_source(version, info['from'])
                assert git_source is not None, f'{name} is not a valid Git source'
                source = git_source
            else:
                # NOTE: npm ignores the resolved field and just uses the provided
                # registry instead. We follow the same behavior here.
                source = UnresolvedRegistrySource()

            yield Package(name=name, version=version, source=source, lockfile=lockfile)

            if 'dependencies' in info:
                yield from self.process_dependencies(lockfile, info['dependencies'])

    def process_lockfile(self, lockfile: Path) -> Iterator[Package]:
        with open(lockfile) as fp:
            data = json.load(fp)

        assert data['lockfileVersion'] == 1, data['lockfileVersion']

        yield from self.process_dependencies(lockfile, data['dependencies'])


class NpmModuleProvider(ModuleProvider):
    class Options(NamedTuple):
        registry: str
        no_autopatch: bool
        no_trim_index: bool

    class RegistryPackageIndex(NamedTuple):
        url: str
        data: Dict
        used_versions: Set[str]

    def __init__(self, gen: ManifestGenerator, special: SpecialSourceProvider,
                 lockfile_root: Path, options: Options) -> None:
        self.gen = gen
        self.special_source_provider = special
        self.lockfile_root = lockfile_root
        self.registry = options.registry
        self.no_autopatch = options.no_autopatch
        self.no_trim_index = options.no_trim_index
        self.npm_cache_dir = self.gen.data_root / 'npm-cache'
        self.cacache_dir = self.npm_cache_dir / '_cacache'
        # Awaitable so multiple tasks can be waiting on the same package info.
        self.registry_packages: Dict[
            str, asyncio.Future[NpmModuleProvider.RegistryPackageIndex]] = {}
        self.index_entries: Dict[Path, str] = {}
        self.all_lockfiles: Set[Path] = set()
        # Mapping of lockfiles to a dict of the Git source target paths and GitSource objects.
        self.git_sources: DefaultDict[Path, Dict[
            Path, GitSource]] = collections.defaultdict(lambda: {})

    def __exit__(self, *_: Any) -> None:
        self._finalize()

    def get_cacache_integrity_path(self, integrity: Integrity) -> Path:
        digest = integrity.digest
        return Path(digest[0:2]) / digest[2:4] / digest[4:]

    def get_cacache_index_path(self, integrity: Integrity) -> Path:
        return self.cacache_dir / Path('index-v5') / self.get_cacache_integrity_path(
            integrity)

    def get_cacache_content_path(self, integrity: Integrity) -> Path:
        return (self.cacache_dir / Path('content-v2') / integrity.algorithm /
                self.get_cacache_integrity_path(integrity))

    def add_index_entry(self, url: str, metadata: RemoteUrlMetadata) -> None:
        key = f'make-fetch-happen:request-cache:{url}'
        index_json = json.dumps({
            'key':
                key,
            'integrity':
                f'{metadata.integrity.algorithm}-{metadata.integrity.to_base64()}',
            'time':
                0,
            'size':
                metadata.size,
            'metadata': {
                'url': url,
                'reqHeaders': {},
                'resHeaders': {},
            },
        })

        content_integrity = Integrity.generate(index_json, algorithm='sha1')
        index = '\t'.join((content_integrity.digest, index_json))

        key_integrity = Integrity.generate(key)
        index_path = self.get_cacache_index_path(key_integrity)
        self.index_entries[index_path] = index

    async def resolve_source(self, package: Package) -> ResolvedSource:
        # These results are going to be the same each time.
        if package.name not in self.registry_packages:
            cache_future = asyncio.get_event_loop().create_future()
            self.registry_packages[package.name] = cache_future

            data_url = f'{self.registry}/{package.name}'
            # NOTE: Not cachable, because this is an API call.
            raw_data = await Requests.instance.read_all(data_url, cachable=False)
            data = json.loads(raw_data)

            assert 'versions' in data, f'{data_url} returned an invalid package index'
            cache_future.set_result(
                NpmModuleProvider.RegistryPackageIndex(url=data_url,
                                                       data=data,
                                                       used_versions=set()))

            if not self.no_trim_index:
                for key in list(data):
                    if key != 'versions':
                        del data[key]

        index = await self.registry_packages[package.name]

        versions = index.data['versions']
        assert package.version in versions, \
            f'{package.name} versions available are {", ".join(versions)}, not {package.version}'

        dist = versions[package.version]['dist']
        assert 'tarball' in dist, f'{package.name}@{package.version} has no tarball in dist'

        index.used_versions.add(package.version)

        integrity: Integrity
        if 'integrity' in dist:
            integrity = Integrity.parse(dist['integrity'])
        elif 'shasum' in dist:
            integrity = Integrity.from_sha1(dist['shasum'])
        else:
            assert False, f'{package.name}@{package.version} has no integrity in dist'

        return ResolvedSource(resolved=dist['tarball'], integrity=integrity)

    async def generate_package(self, package: Package) -> None:
        self.all_lockfiles.add(package.lockfile)
        source = package.source

        assert not isinstance(source, ResolvedSource)

        if isinstance(source, UnresolvedRegistrySource):
            source = await self.resolve_source(package)
            assert source.resolved is not None
            assert source.integrity is not None

            integrity = await source.retrieve_integrity()
            size = await RemoteUrlMetadata.get_size(source.resolved, cachable=True)
            metadata = RemoteUrlMetadata(integrity=integrity, size=size)
            content_path = self.get_cacache_content_path(integrity)
            self.gen.add_url_source(source.resolved, integrity, content_path)
            self.add_index_entry(source.resolved, metadata)

            await self.special_source_provider.generate_special_sources(package)

        elif isinstance(source, GitSource):
            # Get a unique name to use for the Git repository folder.
            name = f'{package.name}-{source.commit}'
            path = self.gen.data_root / 'git-packages' / name
            self.git_sources[package.lockfile][path] = source
            self.gen.add_git_source(source.url, source.commit, path)

    def relative_lockfile_dir(self, lockfile: Path) -> Path:
        return lockfile.parent.relative_to(self.lockfile_root)

    def _finalize(self) -> None:
        for name, async_index in self.registry_packages.items():
            index = async_index.result()

            if not self.no_trim_index:
                for version in list(index.data['versions'].keys()):
                    if version not in index.used_versions:
                        del index.data['versions'][version]

            raw_data = json.dumps(index.data).encode()

            metadata = RemoteUrlMetadata(integrity=Integrity.generate(raw_data),
                                         size=len(raw_data))
            content_path = self.get_cacache_content_path(metadata.integrity)
            self.gen.add_data_source(raw_data, content_path)
            self.add_index_entry(index.url, metadata)

        patch_commands: DefaultDict[Path, List[str]] = collections.defaultdict(lambda: [])

        if self.git_sources:
            # Generate jq scripts to patch the package*.json files.
            scripts = {
                'package.json':
                    '''
                    walk(
                        if type == "object"
                        then
                            to_entries | map(
                                if (.value | type == "string") and $data[.value]
                                then .value = "git+file:\($buildroot)/\($data[.value])"
                                else .
                                end
                            ) | from_entries
                        else .
                        end
                    )
                ''',
                'package-lock.json':
                    '''
                    walk(
                        if type == "object" and (.version | type == "string") and $data[.version]
                        then
                            .version = "git+file:\($buildroot)/\($data[.version])"
                        else .
                        end
                    )
                ''',
            }

            for lockfile, sources in self.git_sources.items():
                prefix = self.relative_lockfile_dir(lockfile)
                data: Dict[str, Dict[str, str]] = {
                    'package.json': {},
                    'package-lock.json': {},
                }

                for path, source in sources.items():
                    original_version = f'{source.original}#{source.commit}'
                    new_version = f'{path}#{source.commit}'
                    data['package.json'][source.from_] = new_version
                    data['package-lock.json'][original_version] = new_version

                for filename, script in scripts.items():
                    target = Path('$FLATPAK_BUILDER_BUILDDIR') / prefix / filename
                    script = textwrap.dedent(script.lstrip('\n')).strip().replace(
                        '\n', '')
                    json_data = json.dumps(data[filename])
                    patch_commands[lockfile].append(
                        'jq'
                        ' --arg buildroot "$FLATPAK_BUILDER_BUILDDIR"'
                        f' --argjson data {shlex.quote(json_data)}'
                        f' {shlex.quote(script)} {target}'
                        f' > {target}.new')
                    patch_commands[lockfile].append(f'mv {target}{{.new,}}')

        patch_all_commands: List[str] = []
        for lockfile in self.all_lockfiles:
            patch_dest = self.gen.data_root / 'patch' / self.relative_lockfile_dir(
                lockfile)
            # Don't use with_extension to avoid problems if the package has a . in its name.
            patch_dest = patch_dest.with_name(patch_dest.name + '.sh')

            self.gen.add_script_source(patch_commands[lockfile], patch_dest)
            patch_all_commands.append(f'$FLATPAK_BUILDER_BUILDDIR/{patch_dest}')

        patch_all_dest = self.gen.data_root / 'patch-all.sh'
        self.gen.add_script_source(patch_all_commands, patch_all_dest)

        if not self.no_autopatch:
            # FLATPAK_BUILDER_BUILDDIR isn't defined yet for script sources.
            self.gen.add_command(f'FLATPAK_BUILDER_BUILDDIR=$PWD {patch_all_dest}')

        if self.index_entries:
            # (ab-)use a "script" module to generate the index.
            parents: Set[str] = set()

            for path in self.index_entries:
                for parent in map(str, path.relative_to(self.cacache_dir).parents):
                    if parent != '.':
                        parents.add(parent)

            index_commands: List[str] = []
            index_commands.append('import os')
            index_commands.append(f'os.chdir({str(self.cacache_dir)!r})')

            for parent in sorted(parents, key=len):
                index_commands.append(f'os.mkdir({parent!r})')

            for path, entry in self.index_entries.items():
                path = path.relative_to(self.cacache_dir)
                index_commands.append(f'with open({str(path)!r}, "w") as fp:')
                index_commands.append(f'    fp.write({entry!r})')

            script_dest = self.gen.data_root / 'generate-index.py'
            self.gen.add_script_source(index_commands, script_dest)
            self.gen.add_command(f'python3 {script_dest}')


class YarnLockfileProvider(LockfileProvider):
    def unquote(self, string: str) -> str:
        if string.startswith('"'):
            assert string.endswith('"')
            return string[1:-1]
        else:
            return string

    def parse_package_section(self, lockfile: Path, section: List[str]) -> Package:
        assert section
        name_line = section[0]
        assert name_line.endswith(':'), name_line
        name_line = name_line[:-1]

        name = self.unquote(name_line.split(',', 1)[0])
        name, _ = name.rsplit('@', 1)

        version: Optional[str] = None
        resolved: Optional[str] = None
        integrity: Optional[Integrity] = None

        section_indent = 0

        for line in section[1:]:
            indent = 0
            while line[indent].isspace():
                indent += 1

            assert indent, line
            if not section_indent:
                section_indent = indent
            elif indent > section_indent:
                # Inside some nested section.
                continue

            line = line.strip()
            if line.startswith('version'):
                version = self.unquote(line.split(' ', 1)[1])
            elif line.startswith('resolved'):
                resolved = self.unquote(line.split(' ', 1)[1])
            elif line.startswith('integrity'):
                _, values_str = line.split(' ', 1)
                values = self.unquote(values_str).split(' ')
                integrity = Integrity.parse(values[0])

        assert version and resolved, line

        source = ResolvedSource(resolved=resolved, integrity=integrity)
        return Package(name=name, version=version, source=source, lockfile=lockfile)

    def process_lockfile(self, lockfile: Path) -> Iterator[Package]:
        section: List[str] = []

        with open(lockfile) as fp:
            for line in map(str.rstrip, fp):
                if not line.strip() or line.strip().startswith('#'):
                    continue

                if not line[0].isspace():
                    if section:
                        yield self.parse_package_section(lockfile, section)
                        section = []

                section.append(line)

        if section:
            yield self.parse_package_section(lockfile, section)


class YarnModuleProvider(ModuleProvider):
    # From https://github.com/yarnpkg/yarn/blob/v1.22.4/src/fetchers/tarball-fetcher.js
    _PACKAGE_TARBALL_URL_RE = re.compile(
        r'(?:(@[^/]+)(?:/|%2f))?[^/]+/(?:-|_attachments)/(?:@[^/]+/)?([^/]+)$')

    def __init__(self, gen: ManifestGenerator, special: SpecialSourceProvider) -> None:
        self.gen = gen
        self.special_source_provider = special
        self.mirror_dir = self.gen.data_root / 'yarn-mirror'

    def __exit__(self, *_: Any) -> None:
        pass

    async def generate_package(self, package: Package) -> None:
        source = package.source
        # Yarn doesn't use GitSource.
        assert isinstance(source, ResolvedSource)

        integrity = await source.retrieve_integrity()

        url_parts = urllib.parse.urlparse(source.resolved)
        match = self._PACKAGE_TARBALL_URL_RE.search(url_parts.path)
        if match is not None:
            scope, filename = match.groups()
            if scope:
                filename = f'{scope}-{filename}'
        else:
            filename = os.path.basename(url_parts.path)

        self.gen.add_url_source(source.resolved, integrity, self.mirror_dir / filename)

        await self.special_source_provider.generate_special_sources(package)


class ProviderFactory:
    def create_lockfile_provider(self) -> LockfileProvider:
        raise NotImplementedError()

    def create_module_provider(self, gen: ManifestGenerator,
                               special: SpecialSourceProvider) -> ModuleProvider:
        raise NotImplementedError()


class NpmProviderFactory(ProviderFactory):
    class Options(NamedTuple):
        lockfile: NpmLockfileProvider.Options
        module: NpmModuleProvider.Options

    def __init__(self, lockfile_root: Path, options: Options) -> None:
        self.lockfile_root = lockfile_root
        self.options = options

    def create_lockfile_provider(self) -> NpmLockfileProvider:
        return NpmLockfileProvider(self.options.lockfile)

    def create_module_provider(self, gen: ManifestGenerator,
                               special: SpecialSourceProvider) -> NpmModuleProvider:
        return NpmModuleProvider(gen, special, self.lockfile_root, self.options.module)


class YarnProviderFactory(ProviderFactory):
    def __init__(self) -> None:
        pass

    def create_lockfile_provider(self) -> YarnLockfileProvider:
        return YarnLockfileProvider()

    def create_module_provider(self, gen: ManifestGenerator,
                               special: SpecialSourceProvider) -> YarnModuleProvider:
        return YarnModuleProvider(gen, special)


class GeneratorProgress(contextlib.AbstractContextManager):
    def __init__(self, packages: Collection[Package],
                 module_provider: ModuleProvider) -> None:
        self.finished = 0
        self.packages = packages
        self.module_provider = module_provider
        self.previous_package: Optional[Package] = None
        self.current_package: Optional[Package] = None

    def __exit__(self, *_: Any) -> None:
        print()

    def _format_package(self, package: Package, max_width: int) -> str:
        result = f'{package.name} @ {package.version}'

        if len(result) > max_width:
            result = result[:max_width - 3] + '...'

        return result

    def _update(self) -> None:
        columns, _ = shutil.get_terminal_size()

        sys.stdout.write('\r' + ' ' * columns)

        prefix_string = f'\rGenerating packages [{self.finished}/{len(self.packages)}] '
        sys.stdout.write(prefix_string)
        max_package_width = columns - len(prefix_string)

        if self.current_package is not None:
            sys.stdout.write(self._format_package(self.current_package,
                                                  max_package_width))

        sys.stdout.flush()

    def _update_with_package(self, package: Package) -> None:
        self.previous_package, self.current_package = self.current_package, package
        self._update()

    async def _generate(self, package: Package) -> None:
        self._update_with_package(package)
        await self.module_provider.generate_package(package)
        self.finished += 1
        self._update_with_package(package)

    async def run(self) -> None:
        self._update()
        await asyncio.wait(map(self._generate, self.packages))


def scan_for_lockfiles(base: Path, patterns: List[str]) -> Iterator[Path]:
    for root, dirs, files in os.walk(base.parent):
        if base.name in files:
            lockfile = Path(root) / base.name
            if not patterns or any(map(lockfile.match, patterns)):
                yield lockfile


async def main() -> None:
    parser = argparse.ArgumentParser(description='Flatpak Node generator')
    parser.add_argument('type', choices=['npm', 'yarn'])
    parser.add_argument('lockfile',
                        help='The lockfile path (package-lock.json or yarn.lock)')
    parser.add_argument('-o',
                        '--output',
                        help='The output sources file',
                        default='generated-sources.json')
    parser.add_argument(
        '-r',
        '--recursive',
        action='store_true',
        help='Recursively process all files under the lockfile directory with '
        'the lockfile basename')
    parser.add_argument(
        '-R',
        '--recursive-pattern',
        action='append',
        help='Given -r, restrict files to those matching the given pattern.')
    parser.add_argument('--registry',
                        help='The registry to use (npm only)',
                        default='https://registry.npmjs.org')
    parser.add_argument('--no-trim-index',
                        action='store_true',
                        help="Don't trim npm package metadata (npm only)")
    parser.add_argument('--no-devel',
                        action='store_true',
                        help="Don't include devel dependencies (npm only)")
    parser.add_argument('--no-aiohttp',
                        action='store_true',
                        help="Don't use aiohttp, and silence any warnings related to it")
    parser.add_argument('--no-requests-cache',
                        action='store_true',
                        help='Disable the requests cache')
    parser.add_argument('--retries',
                        type=int,
                        help='Number of retries of failed requests',
                        default=Requests.DEFAULT_RETRIES)
    parser.add_argument('-P',
                        '--no-autopatch',
                        action='store_true',
                        help="Don't automatically patch Git sources from package*.json")
    parser.add_argument('-s',
                        '--split',
                        action='store_true',
                        help='Split the sources file to fit onto GitHub.')
    parser.add_argument('--node-chromedriver-from-electron',
                        help='Use the ChromeDriver version associated with the given '
                        'Electron version for node-chromedriver')
    # Deprecated alternative to --node-chromedriver-from-electron
    parser.add_argument('--electron-chromedriver', help=argparse.SUPPRESS)
    parser.add_argument('--electron-ffmpeg',
                        choices=['archive', 'lib'],
                        help='Download the ffmpeg binaries')
    parser.add_argument('--electron-node-headers',
                        action='store_true',
                        help='Download the electron node headers')
    parser.add_argument('--xdg-layout',
                        action='store_true',
                        help='Use XDG layout for caches')
    # Internal option, useful for testing.
    parser.add_argument('--stub-requests', action='store_true', help=argparse.SUPPRESS)

    args = parser.parse_args()

    Requests.retries = args.retries

    if args.type == 'yarn' and (args.no_devel or args.no_autopatch):
        sys.exit('--no-devel and --no-autopatch do not apply to Yarn.')

    if args.electron_chromedriver:
        print('WARNING: --electron-chromedriver is deprecated', file=sys.stderr)
        print('  (Use --node-chromedriver-from-electron instead.)', file=sys.stderr)

    if args.stub_requests:
        Requests.instance = StubRequests()
    elif args.no_aiohttp:
        if Requests.instance.is_async:
            Requests.instance = UrllibRequests()
    elif not Requests.instance.is_async:
        print('WARNING: aiohttp is not found, performance will suffer.', file=sys.stderr)
        print('  (Pass --no-aiohttp to silence this warning.)', file=sys.stderr)

    if not args.no_requests_cache:
        Cache.instance = FilesystemBasedCache()

    lockfiles: List[Path]
    if args.recursive or args.recursive_pattern:
        lockfiles = list(scan_for_lockfiles(Path(args.lockfile), args.recursive_pattern))
        if not lockfiles:
            sys.exit('No lockfiles found.')
        print(f'Found {len(lockfiles)} lockfiles.')
    else:
        lockfiles = [Path(args.lockfile)]

    lockfile_root = Path(args.lockfile).parent

    provider_factory: ProviderFactory
    if args.type == 'npm':
        npm_options = NpmProviderFactory.Options(
            NpmLockfileProvider.Options(no_devel=args.no_devel),
            NpmModuleProvider.Options(registry=args.registry,
                                      no_autopatch=args.no_autopatch,
                                      no_trim_index=args.no_trim_index))
        provider_factory = NpmProviderFactory(lockfile_root, npm_options)
    elif args.type == 'yarn':
        provider_factory = YarnProviderFactory()
    else:
        assert False, args.type

    print('Reading packages from lockfiles...')
    packages: Set[Package] = set()

    for lockfile in lockfiles:
        lockfile_provider = provider_factory.create_lockfile_provider()
        packages.update(lockfile_provider.process_lockfile(lockfile))

    print(f'{len(packages)} packages read.')

    gen = ManifestGenerator()
    with gen:
        options = SpecialSourceProvider.Options(
            node_chromedriver_from_electron=args.node_chromedriver_from_electron
            or args.electron_chromedriver,
            xdg_layout=args.xdg_layout,
            electron_ffmpeg=args.electron_ffmpeg,
            electron_node_headers=args.electron_node_headers)
        special = SpecialSourceProvider(gen, options)

        with provider_factory.create_module_provider(gen, special) as module_provider:
            with GeneratorProgress(packages, module_provider) as progress:
                await progress.run()

    if args.split:
        for i, part in enumerate(gen.split_sources()):
            output = Path(args.output)
            output = output.with_suffix(f'.{i}{output.suffix}')
            with open(output, 'w') as fp:
                json.dump(part, fp, indent=ManifestGenerator.JSON_INDENT)

        print(f'Wrote {gen.source_count} to {i + 1} file(s).')
    else:
        with open(args.output, 'w') as fp:
            json.dump(list(gen.ordered_sources()),
                      fp,
                      indent=ManifestGenerator.JSON_INDENT)

            if fp.tell() >= ManifestGenerator.MAX_GITHUB_SIZE:
                print('WARNING: generated-sources.json is too large for GitHub.',
                      file=sys.stderr)
                print('  (Pass -s to enable splitting.)')

        print(f'Wrote {gen.source_count} source(s).')


if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(main())
