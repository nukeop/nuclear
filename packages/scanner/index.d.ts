type LocalTrack = {
    uuid: string;
    artist?: string;
    title?: string;
    album?: string;
    duration?: number;
    position?: number;
    year?: string;

    filename: string;
    path: string;
    local: true;
}

declare const scanFolders = (folders: string[], supportedFormats: string[], onProgress: (progress: number, total: number, lastScanned?: string) => void) => Promise<LocalTrack[]>;
export { scanFolders };
