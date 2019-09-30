import { spawn } from 'child_process';
import es from 'event-stream';
import concat from 'concat-stream';
import filter from 'stream-filter';
import reduce from 'stream-reduce';
import path from 'path';
import platform from 'electron-platform';

import getBinaryPath from './binaries';

export default function(file, options = {}) {
  // Handle `options` parameter being optional
  return new Promise((resolve, reject) => {
    // Command-line arguments to pass to fpcalc
    const args = [];
  
    // `-length` command-line argument
    if (options.length) {
      args.push('-length', options.length);
    }
  
    // `-raw` command-line argument
    if (options.raw) {
      args.push('-raw');
    }
  
    if (file && typeof file.pipe === 'function') {
      args.push('-');
      options.stdin = file;
    } else {
      args.push(file);
    }
  
    run(args, options)
      .on('error', reject)
      .pipe(parse())
      .on('data', function(results) {
        if (options.raw) {
          const fingerprint = results.fingerprint.split(',').map(function(value) {
            return parseInt(value);
          });
          results.fingerprintRaw = results.fingerprint;
          results.fingerprint = new Buffer(fingerprint.length * 4);
          for (let i = 0; i < fingerprint.length; i++) {
            results.fingerprint.writeInt32BE(fingerprint[i], i * 4, true);
          }
        }
        resolve(results);
      });
  });
}

// -- Run fpcalc command

// Runs the fpcalc tool and returns a readable stream that will emit stdout
// or an error event if an error occurs
function run(args, options) {
  const command = options.command || (platform.isWin32 ? 'fpcalc.exe' : 'fpcalc');
  const commandPath = path.join(getBinaryPath(), command);
  const cp = spawn(commandPath, args);
  const stream = es.through(null, function() {});

  // If passed stdin stream, pipe it to the child process
  if (options.stdin) {
    options.stdin.pipe(cp.stdin);
  }

  // Pass fpcalc stdout through the stream
  cp.stdout.pipe(stream);

  // Catch fpcalc stderr errors even when exit code is 0
  // See https://bitbucket.org/acoustid/chromaprint/issue/2/fpcalc-return-non-zero-exit-code-if
  cp.stderr.pipe(
    concat(function(data) {
      if (data && (data = data.toString()) && data.slice(0, 6) === 'ERROR:') {
        stream.emit('error', new Error(data));
      }
    })
  );

  // Check process exit code and end the stream
  cp.on('close', function(code) {
    if (code !== 0) {
      stream.emit('error', new Error('fpcalc failed'));
    }

    stream.queue(null);
  });

  return stream;
}

// -- fpcalc stdout stream parsing

function parse() {
  return es.pipeline(
    // Parse one complete line at a time
    es.split(),
    // Only use non-empty lines
    filter(Boolean),
    // Parse each line into name/value pair
    es.mapSync(parseData),
    // Reduce data into single result object to pass to callback
    reduce(function(result, data) {
      result[data.name] = data.value;
      return result;
    }, {})
  );
}

// Data is given as lines like `FILE=path/to/file`, so we split the
// parts out to a name/value pair
function parseData(buffer) {
  const data = buffer.toString();
  const index = data.indexOf('=');

  return {
    name: data.slice(0, index).toLowerCase(),
    value: data.slice(index + 1)
  };
}
