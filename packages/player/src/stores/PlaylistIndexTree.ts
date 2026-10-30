import { produce, type Draft } from 'immer';

import type {
  PlaylistFolder,
  PlaylistIndexEntry,
  PlaylistIndexNode,
} from '@nuclearplayer/model';

const isFolder = (node: PlaylistIndexNode): node is PlaylistFolder =>
  node.kind === 'folder';

export class PlaylistIndexTree {
  constructor(readonly nodes: PlaylistIndexNode[]) {}

  playlists(): PlaylistIndexEntry[] {
    return this.nodes.flatMap((node) => {
      if (isFolder(node)) {
        return node.playlists;
      }
      return [node];
    });
  }

  folders(): PlaylistFolder[] {
    return this.nodes.filter(isFolder);
  }

  folder(id: string | undefined): PlaylistFolder | undefined {
    return this.folders().find((folder) => folder.id === id);
  }

  folderOf(playlistId: string): PlaylistFolder | undefined {
    return this.folders().find((folder) =>
      folder.playlists.some((playlist) => playlist.id === playlistId),
    );
  }

  savePlaylist(
    entry: PlaylistIndexEntry,
    folderId?: string,
  ): PlaylistIndexTree {
    return this.#update((draft) => {
      const location = findPlaylist(draft, entry.id);
      if (location) {
        location.list[location.position] = entry;
        return;
      }
      containerOf(draft, folderId).push(entry);
    });
  }

  removePlaylist(id: string): PlaylistIndexTree {
    return this.#update((draft) => {
      const location = findPlaylist(draft, id);
      location?.list.splice(location.position, 1);
    });
  }

  addFolder(id: string, name: string): PlaylistIndexTree {
    return this.#update((draft) => {
      draft.push({ kind: 'folder', id, name, playlists: [] });
    });
  }

  renameFolder(id: string, name: string): PlaylistIndexTree {
    return this.#update((draft) => {
      requireFolder(draft, id).name = name;
    });
  }

  removeFolder(id: string): PlaylistIndexTree {
    return this.#update((draft) => {
      const folder = requireFolder(draft, id);
      draft.splice(draft.indexOf(folder), 1, ...folder.playlists);
    });
  }

  movePlaylistToFolder(
    playlistId: string,
    folderId: string | undefined,
  ): PlaylistIndexTree {
    return this.#update((draft) => {
      const destination = containerOf(draft, folderId);
      const location = findPlaylist(draft, playlistId);
      if (!location) {
        throw new Error(`Playlist ${playlistId} not found`);
      }
      const [entry] = location.list.splice(location.position, 1);
      destination.push(entry);
    });
  }

  moveEntry(
    fromIndex: number,
    toIndex: number,
    folderId?: string,
  ): PlaylistIndexTree {
    return this.#update((draft) => {
      const list = containerOf(draft, folderId);
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
    });
  }

  #update(
    recipe: (draft: Draft<PlaylistIndexNode[]>) => void,
  ): PlaylistIndexTree {
    return new PlaylistIndexTree(produce(this.nodes, recipe));
  }
}

type PlaylistLocation = {
  list: Draft<PlaylistIndexNode>[];
  position: number;
};

const findPlaylist = (
  nodes: Draft<PlaylistIndexNode[]>,
  id: string,
): PlaylistLocation | undefined => {
  const lists = [
    nodes,
    ...nodes.filter(isFolder).map((folder) => folder.playlists),
  ];
  for (const list of lists) {
    const position = list.findIndex(
      (node) => node.kind === 'playlist' && node.id === id,
    );
    if (position >= 0) {
      return { list, position };
    }
  }
  return undefined;
};

const findFolder = (
  nodes: Draft<PlaylistIndexNode[]>,
  id: string | undefined,
): Draft<PlaylistFolder> | undefined =>
  nodes.filter(isFolder).find((folder) => folder.id === id);

const requireFolder = (
  nodes: Draft<PlaylistIndexNode[]>,
  id: string,
): Draft<PlaylistFolder> => {
  const folder = findFolder(nodes, id);
  if (!folder) {
    throw new Error(`Playlist folder ${id} not found`);
  }
  return folder;
};

const containerOf = (
  nodes: Draft<PlaylistIndexNode[]>,
  folderId: string | undefined,
): Draft<PlaylistIndexNode>[] => {
  if (folderId === undefined) {
    return nodes;
  }
  return requireFolder(nodes, folderId).playlists;
};
