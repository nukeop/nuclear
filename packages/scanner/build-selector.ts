/* eslint-disable no-console */
import { exec } from 'child_process';

const targetArch = process.env.npm_config_target_arch ?? 'x64';

const commands: { [key: string]: string } = {
  'arm64': 'npm run build-macos-arm64',
  'x64': 'npm run build-macos'
};

const defaultCommand = 'npm run build-linux-windows';

const commandToRun = commands[targetArch] || defaultCommand;

exec(commandToRun, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error.message}`);
    return;
  }
  if (stdout) {
    console.log(`stdout: ${stdout}`);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
});
