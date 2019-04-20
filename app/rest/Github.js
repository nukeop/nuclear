import {
  githubClientId
} from '../globals';

const GITHUB_OAUTH_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
export const GITHUB_OAUTH_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
export const GITHUB_API_USER_ENDPOINT = 'https://api.github.com/user';


export const getGithubOauthUrl = () => {
  return GITHUB_OAUTH_AUTHORIZE_URL +
    '?client_id=' +
    githubClientId +
    '&redirect_uri=' +
    window.location.href;
};
