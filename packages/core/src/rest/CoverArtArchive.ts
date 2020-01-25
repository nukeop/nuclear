const apiUrl = 'https://coverartarchive.org';

export type CoverArtArchiveResult = {
  ok: boolean;
  url: string;
}

const getCoverForRelease = (releaseId: string): Promise<CoverArtArchiveResult> => {
  return fetch(`${apiUrl}/release-group/${releaseId}/front`);
};

export default {
  getCoverForRelease
};
