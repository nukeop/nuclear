/* eslint-disable @typescript-eslint/no-explicit-any */
import { stringify } from 'querystring';
import { spawn } from 'child_process';
import { Stream, PassThrough } from 'stream';
import concat from 'concat-stream';
import split from 'split2';
import filter from 'stream-filter';
import reduce from 'stream-reduce';
import path from 'path';
import { inject, injectable } from 'inversify';

import Config from '../config';
import Platform from '../platform';

/**
 * Generate audio fingerprint with fpcalc
 * Send fingerprint to acousticId and get metadata 
 * @see {@link https://acoustid.org/}
 * @see {@link https://helpmanual.io/help/fpcalc/}
 */
@injectable()
class AcousticId {
  
  constructor(
    @inject(Config) private config: Config,
    @inject(Platform) private platform: Platform
  ) {}

  /**
   * Fetch acousticId metadata, with a fingerprint of the sound obtained with fpcalc
   */
  async getMetadata(filePath: string): Promise<any> {
    const { duration, fingerprint } = await this.getFingerPrint(filePath);

    const query = {
      format: 'json',
      meta: 'recordings',
      client: this.config.acousticId.key,
      duration,
      fingerprint
    };

    const res = await fetch(`${this.config.acousticId.url}?${stringify(query)}`);

    return res.json();
  }

  /**
   * Transform fpCalc stream
   */
  private reduceFpCalcStream(acc: any, buffer: Buffer): any {
    const data = buffer.toString();
    const index = data.indexOf('=');
  
    return {
      [data.slice(0, index).toLowerCase()]: data.slice(index + 1),
      ...acc
    };
  }

  /**
   * run fpCalc and extract sound fingerprint
   */
  async getFingerPrint(file: string): Promise<{ duration: number; fingerprint: string }> {
    return new Promise((resolve, reject) => {
      this.runFpCalc(file)
        .pipe(split())
        .pipe(filter(Boolean))
        .pipe(reduce(this.reduceFpCalcStream, {}))
        .on('error', reject)
        .on('data', resolve);
    });
  }

  /**
   * run fpcalc binaries
   */
  runFpCalc(file: string): Stream {
    const command = this.platform.isWindows() ? 'fpcalc.exe' : 'fpcalc';
    const commandPath = path.join(this.platform.getBinaryPath(), command);
    const cp = spawn(commandPath, [file]);
    const stream = new PassThrough();
    
    cp.stdout.pipe(stream);
  
    // Catch fpcalc stderr errors even when exit code is 0
    // See https://bitbucket.org/acoustid/chromaprint/issue/2/fpcalc-return-non-zero-exit-code-if
    cp.stderr.pipe(
      concat((data) => {
        if (data && data.toString().slice(0, 6) === 'ERROR:') {
          stream.emit('error', new Error(data.toString()));
        }
      })
    );
  
    cp.on('close', (code) => {
      if (code !== 0) {
        stream.emit('error', new Error('fpcalc failed'));
      }
    });
  
    return stream;
  }
}

export default AcousticId;
