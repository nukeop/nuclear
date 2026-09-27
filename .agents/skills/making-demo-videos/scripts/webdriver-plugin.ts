import { $ } from 'bun';

const pluginCall = 'tauri_plugin_wdio_webdriver::init()';

const config = {
  dependency: `
[target.'cfg(debug_assertions)'.dependencies]
tauri-plugin-wdio-webdriver = "=1.4.0"
`,
  pluginCall,
  registrationAnchor: '    if !is_flatpak {',
  registration: `    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(${pluginCall});
    }

`,
};

const repositoryRoot = (await $`git rev-parse --show-toplevel`.text()).trim();
const tauriDirectory = `${repositoryRoot}/packages/player/src-tauri`;
const cargoToml = `${tauriDirectory}/Cargo.toml`;
const libRs = `${tauriDirectory}/src/lib.rs`;
const changedFiles = [cargoToml, `${tauriDirectory}/Cargo.lock`, libRs];

const add = async () => {
  const hasChanges =
    (await $`git diff --quiet -- ${changedFiles}`.nothrow()).exitCode !== 0;
  if (hasChanges) {
    throw new Error(
      'Commit or stash the changes in Cargo.toml, Cargo.lock and lib.rs first.',
    );
  }
  const source = await Bun.file(libRs).text();
  if (!source.includes(config.registrationAnchor)) {
    throw new Error(
      `lib.rs has no line "${config.registrationAnchor.trim()}" to register the plugin before.`,
    );
  }
  await Bun.write(
    cargoToml,
    (await Bun.file(cargoToml).text()) + config.dependency,
  );
  await Bun.write(
    libRs,
    source.replace(
      config.registrationAnchor,
      config.registration + config.registrationAnchor,
    ),
  );
  await $`cargo check --quiet`.cwd(tauriDirectory);
  console.log(
    'Plugin added. The running dev build restarts. Wait until http://127.0.0.1:4445/status reports ready.',
  );
};

const remove = async () => {
  if (!(await Bun.file(libRs).text()).includes(config.pluginCall)) {
    throw new Error('The plugin is not registered in lib.rs.');
  }
  await $`git checkout -- ${changedFiles}`;
  console.log('Plugin removed.');
};

const commands: Record<string, () => Promise<void>> = { add, remove };
const command = commands[Bun.argv[2] ?? ''];
if (!command) {
  throw new Error('Usage: bun webdriver-plugin.ts add|remove');
}
await command();
