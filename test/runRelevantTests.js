const execa = require('execa');
const path = require('path');
const branch = process.env.CIRCLE_BRANCH;

const shellCommandForChangedFiles = `git diff --name-only remotes/origin/master...${branch} | grep .js$`;

execa
  .shell(shellCommandForChangedFiles)
  .then(({ stdout, stderr }) => {
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout.replace(/\n/g, ' ');
  })
  .then(changedFiles =>
    execa
      .shell(`jest --listTests --findRelatedTests ${changedFiles}`)
      .then(({ stdout, stderr }) => {
        if (stderr) {
          throw new Error(stderr);
        }
        return {
          changedFiles: changedFiles.split(' '),
          relatedTests: JSON.parse(stdout)
        };
      })
  )
  .then(ctx => {
    if (ctx.relatedTests.length < 1) {
      // wow, nothing to test!
      return;
    }
    const collectCoverageFrom = ctx.changedFiles
      .map(from => `--collectCoverageFrom '${from}'`)
      .join(' ');
    const testFiles = ctx.relatedTests
      .map(testFile =>
        path.relative(process.cwd(), testFile)
      )
      .join(' ');
    const coverageCommand = `jest --coverage ${collectCoverageFrom} ${testFiles}`;
    return execa
      .shell(coverageCommand, { stdio: 'inherit' })
      .catch(() => {
        process.exitCode = 1;
      });
  });