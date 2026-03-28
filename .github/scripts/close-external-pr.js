module.exports = async ({ github, context }) => {
  const { owner, repo } = context.repo;
  const prNumber = context.payload.pull_request.number;

  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: [
      'Thanks for your interest in Nuclear, but this repository does not accept external pull requests.',
      '',
      'If you want to extend Nuclear, consider writing a plugin instead.',
      'See [CONTRIBUTING.md](../blob/master/CONTRIBUTING.md) and the [contributing guide](https://docs.nuclearplayer.com/nuclear/development/contributing) for details.',
    ].join('\n'),
  });

  await github.rest.pulls.update({
    owner,
    repo,
    pull_number: prNumber,
    state: 'closed',
  });
};
