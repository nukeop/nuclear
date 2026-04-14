module.exports = async ({ github, context }) => {
  const { owner, repo } = context.repo;
  const issueNumber = context.payload.issue.number;

  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: [
      'Nuclear does not accept external issues.',
      '',
      'If you want to discuss Nuclear, use the [Discussions](https://github.com/nukeop/nuclear/discussions) tab.',
    ].join('\n'),
  });

  await github.rest.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    state: 'closed',
    state_reason: 'not_planned',
  });
};
