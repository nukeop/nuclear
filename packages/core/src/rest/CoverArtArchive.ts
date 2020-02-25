const apiUrl = 'https://coverartarchive.org';

export type CoverArtArchiveResult = {
  ok: boolean;
  url: string;
}

const getCoverForReleaseGroup = (releaseGroupId: string): Promise<CoverArtArchiveResult> => {
  return fetch(`${apiUrl}/release-group/${releaseGroupId}/front`);
};

const getCoverForRelease = (releaseId: string): Promise<CoverArtArchiveResult> => {
  return fetch(`${apiUrl}/release/${releaseId}/front`);
};

export default {
  getCoverForReleaseGroup,
  getCoverForRelease
};
