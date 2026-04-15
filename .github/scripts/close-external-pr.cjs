module.exports = async ({ github, context }) => {
  const { owner, repo } = context.repo;
  const prNumber = context.payload.pull_request.number;

  const files = await github.paginate(github.rest.pulls.listFiles, {
    owner,
    repo,
    pull_number: prNumber,
  });

  const touchesI18n = files.some((file) =>
    file.filename.startsWith('packages/i18n/'),
  );

  const defaultMessage = [
    'Thanks for your interest in Nuclear, but this repository does not accept external pull requests.',
    '',
    'If you want to extend Nuclear, consider writing a plugin instead.',
    'See [CONTRIBUTING.md](../blob/master/CONTRIBUTING.md) and the [contributing guide](https://docs.nuclearplayer.com/nuclear/development/contributing) for details.',
  ].join('\n');

  const i18nMessage = [
    'Thanks for your interest in translating Nuclear!',
    '',
    'We use Crowdin to manage translations. Please contribute translations there instead:',
    'https://crowdin.com/project/nuclear',
    '',
    "If you're new to Crowdin, check out the [getting started guide for translators](https://support.crowdin.com/for-translators/).",
  ].join('\n');

  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: touchesI18n ? i18nMessage : defaultMessage,
  });

  await github.rest.pulls.update({
    owner,
    repo,
    pull_number: prNumber,
    state: 'closed',
  });
};
