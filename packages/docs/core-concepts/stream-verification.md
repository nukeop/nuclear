---
description: Correct streams picked by Nuclear, and help other users fetch the right streams
---

# Stream verification

When you play a track, the streaming provider searches for matching audio and picks the top result. That stream isn't always right: sometimes it's a live version, a cover, a remix, or a different track with a similar name. Stream verification lets you mark which stream is the correct one for a track, and share it with all Nuclear users.

## How Nuclear uses verifications

When a track starts playing, Nuclear asks the stream verification service what's the top stream (according to user votes) for that track. If one exists, Nuclear selects it. If not, it takes its best guess.

If nobody verified a stream for the track, or the service can't be reached, Nuclear plays the search results in their usual order.

Verifications are kept separately for each streaming provider. A stream verified for one provider has no effect when you use a different one.

## The verification bar

The bar at the bottom of the queue panel shows the verification status of the stream that's playing now.

<figure><img src="../.gitbook/assets/stream-verification-bar.png" alt="The stream verification bar with the status Unverified and a Verify button" width="274"><figcaption><p>The verification bar under the queue</p></figcaption></figure>

The status is one of these:

- **Unverified**: nobody verified the playing stream, or a different stream is verified for this track. It has 0 votes.
- **Weakly verified**: a few users verified this stream. It has 1-3 votes.
- **Verified**: many users verified this stream. More than 3 votes.
- **Verified by you**: you verified this stream.

While Nuclear looks up the status, the button shows a placeholder.

## Verify a stream

If the playing stream is the right one, click **Verify**. The status changes to **Verified by you**, and your verification counts toward what other listeners get. If it's not the right one, click the track in the queue with the right mouse button, select the one that's correct, then verify it. Your preference will be saved and you will always hear that stream when you play that track.

To undo your verification, click **Unverify**.

You have one verification per track. If you verify a different stream for the same track later, your verification moves to the new stream.

{% hint style="info" %}
The **Verify** button is disabled until the stream has loaded.
{% endhint %}

## Correct the wrong stream

If the wrong stream is playing:

1. Right-click the track in the queue to open its stream candidates.
2. Click the correct candidate. Nuclear switches to it.
3. Click **Verify** in the verification bar.

<figure><img src="../.gitbook/assets/stream-verification-correct.png" alt="The stream candidates popover open next to the queue, with a live version playing instead of the official audio, and the verification bar showing Unverified" width="614"><figcaption><p>Switching to a different candidate before verifying it</p></figcaption></figure>

See [The queue](the-queue.md#stream-candidates) for more about stream candidates.

## Privacy

Verification doesn't need an account. The first time Nuclear connects to the verification service, it creates a random ID and saves it in your settings. This ID is the only thing that connects your verifications to each other.

Each request sends only the track's artist and title, which streaming provider you use, the stream's ID, and your random ID.

## Turn it off

Open **Settings**, go to **Playback**, and turn off **Stream verification**. With it off, Nuclear doesn't contact the verification service at all, plays search results in their usual order, and hides the verification bar.

<figure><img src="../.gitbook/assets/stream-verification-setting.png" alt="The Stream verification toggle in Settings" width="602"><figcaption><p>The Stream verification setting</p></figcaption></figure>
