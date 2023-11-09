export type LocalTrack = {
    uuid: string;
    artist: string;
    title?: string;
    album?: string;
    duration?: number;
    thumbnail?: string;
    position?: number;
    year?: string;

    filename: string;
    path: string;
    local: true;
}

declare const scanFolders = (
  folders: string[], 
  supportedFormats: string[], 
  thumbnailsDir: string,
  onProgress: (progress: number, total: number, lastScanned?: string) => void,
  onError: (track: string, error: string) => void
) => new Promise<LocalTrack[]>;

declare const generateThumbnail = (filename: string, thumbnailsDir: string) => new Promise<string>;

export { scanFolders, generateThumbnail };
