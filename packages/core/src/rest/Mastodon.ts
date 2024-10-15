import generator from 'megalodon';

export const getClientForInstance = (instanceUrl: string, accessToken?: string) => generator('mastodon', instanceUrl, accessToken);

export const registerNuclear = (instanceUrl: string) => {
  const client = getClientForInstance(instanceUrl);
  return client.registerApp(
    'Nuclear Music Player',
    {
      website: 'https://nuclearplayer.com/'
    }
  );
};

export const getAccessToken = (instanceUrl: string, clientId: string, clientSecret: string, authorizationCode: string) => {
  const client = getClientForInstance(instanceUrl);
  return client.fetchAccessToken(clientId, clientSecret, authorizationCode);
};

export const post = (instanceUrl: string, accessToken: string, content: string) => {
  const client = getClientForInstance(instanceUrl, accessToken);
  return client.postStatus(content);
};
