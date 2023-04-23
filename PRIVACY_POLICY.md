# Nuclear's Privacy Policy

Nuclear is a privacy-focused media player that does not engage in tracking, advertising, profiling, fingerprinting, or any other similar practices. We don't sell anything, and we don't display ads. However, for the sake of transparency, we have created this privacy policy to outline the limited ways in which we collect and use user data.

## General Information

Nuclear is designed to operate without any external services hosted by us. These services are optional, and they provide additional features that cannot function locally. It's essential to note that all communication with these services can be disabled. Alternatively, you can host them yourself, but that may defeat their purpose.

## Hosted Services

All the services that Nuclear hosts are free and open-source. This means that you can inspect their code to see precisely what they do.

### Verification Service

**Repository:** https://github.com/NuclearPlayer/nuclear-verification-service

**Manual:** https://nukeop.gitbook.io/nuclear/user-manual/stream-verification

This service enables you to change the streams Nuclear identifies for the tracks you play. If Nuclear associates an incorrect stream with a track you play, you can correct its choice by telling the server what it should be. When you submit such a correction, the stream you selected will always play for that particular track when you add it to the queue. This way, you also help other users benefit from your verification the same way unless they select a different stream themselves.

**Data Collected:**
- Nuclear generates a random user ID locally to track who verified what. This is not Personally Identifiable Information (PII), as it cannot be traced back to any account or specific individual.
- This is a GUID string.
- The user ID is sent and stored in the database when you verify a track.
- It's also used when you play tracks to retrieve verified stream IDs for you. This is not stored or logged anywhere.

## Feedback

If you have any feedback on this privacy policy, we welcome your comments. You can reach us via Github, Mastodon, or Twitter using the links below:

- Github: https://github.com/nukeop/nuclear
- Mastodon: https://fosstodon.org/@nuclearplayer
- Twitter: https://twitter.com/nuclear_player
