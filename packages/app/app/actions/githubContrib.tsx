const GITHUB_REPO_CONTRIB_ENDPOINT = 'https://api.github.com/repos/nukeop/nuclear/stats/contributors';
  
export const GITHUB_CONTRIB_START = 'GITHUB_CONTRIB_START';
export const GITHUB_CONTRIB_SUCCESS = 'GITHUB_CONTRIB_SUCCESS';
export const GITHUB_CONTRIB_ERROR = 'GITHUB_CONTRIB_ERROR';

function githubContribStart() {
  return {
    type: GITHUB_CONTRIB_START
  };
}

function githubContribSuccess(data) {
  return {
    type: GITHUB_CONTRIB_SUCCESS,
    payload: data
  };
}

function githubContribError(error) {
  return {
    type: GITHUB_CONTRIB_ERROR,
    payload: error
  };
}

export function githubContribInfo() {
  return dispatch => {
    dispatch(githubContribStart());
    fetch(
      GITHUB_REPO_CONTRIB_ENDPOINT,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        dispatch(githubContribSuccess(data));
      })
      .catch(error => {
        dispatch(githubContribError(error));
      });
  };
}
