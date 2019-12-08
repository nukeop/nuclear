import { stringify } from 'querystring';
import { spawn } from 'child_process';
import es from 'event-stream';
import concat from 'concat-stream';
import filter from 'stream-filter';
import reduce from 'stream-reduce';
import path from 'path';

const API_KEY = 'Fivodjxo37';
const API_URL = 'https://api.acoustid.org/v2/lookup';

/**
 * Generate audio fingerprint with fpcalc
 * Send fingerprint to acousticId and get metadata 
 * @see {@link https://acoustid.org/}
 * @see {@link https://helpmanual.io/help/fpcalc/}
 */
class AcousticId {
  constructor({ platform }) {
    /** @type {import('./platform')} */
    this.platform = platform;
  }

  /**
   * Fetch acousticId metadata, with a fingerprint of the sound obtained with fpcalc
   * @param {string} filePath 
   * @return {Promise<object>}
   */
  async getMetadata(filePath) {
    const { duration, fingerprint } = await this._getFingerPrint(filePath);
    const query = {
      format: 'json',
      meta: 'recordings',
      client: API_KEY,
      duration,
      fingerprint
    };

    const res = await fetch(`${API_URL}?${stringify(query)}
  `);

    return res.json();
  }

  /**
   * Transform fpCalc stream
   * @returns {import('stream').Transform}
   */
  _transformFpCalcStream() {
    return es.pipeline(
      es.split(),
      filter(Boolean),
      es.mapSync((buffer) => {
        const data = buffer.toString();
        const index = data.indexOf('=');
      
        return {
          name: data.slice(0, index).toLowerCase(),
          value: data.slice(index + 1)
        };
      }),
      reduce((result, data) => ({
        ...result,
        [data.name]: data.value
      }), {})
    );
  }

  /**
   * run fpCalc and extract sound fingerprint
   * @private
   * @param {string} file 
   * @param {{ length?: number, raw?: any }} options 
   * @returns {Promise<{ duration: number, fingerprint: string }>}
   */
  _getFingerPrint(file, options = {}) {
    return new Promise((resolve, reject) => {
      const args = [];
    
      options.length && args.push('-length', options.length);
      options.raw && args.push('-raw');
      args.push(file);
    
      this._runFpCalc(args, options)
        .on('error', reject)
        .pipe(this._transformFpCalcStream)
        .on('data', (results) => {
          if (options.raw) {
            const fingerprint = results.fingerprint.split(',').map(parseInt);
            results.fingerprintRaw = results.fingerprint;
            results.fingerprint = Buffer.from(fingerprint.length * 4);
            for (let i = 0; i < fingerprint.length; i++) {
              results.fingerprint.writeInt32BE(fingerprint[i], i * 4, true);
            }
          }
          resolve(results);
        });
    });
  }

  /**
   * run fpcalc binaries
   * @private
   * @param {string[]} args 
   * @returns {import('stream').Stream}
   */
  _runFpCalc(args) {
    const command = this.platform.isWin32() ? 'fpcalc.exe' : 'fpcalc';
    const commandPath = path.join(this.platform.getBinaryPath(), command);
    const cp = spawn(commandPath, args);
    const stream = es.through(null, () => {});
  
    cp.stdout.pipe(stream);
  
    // Catch fpcalc stderr errors even when exit code is 0
    // See https://bitbucket.org/acoustid/chromaprint/issue/2/fpcalc-return-non-zero-exit-code-if
    cp.stderr.pipe(
      concat((data) => {
        if (data && (data = data.toString()) && data.slice(0, 6) === 'ERROR:') {
          stream.emit('error', new Error(data));
        }
      })
    );
  
    cp.on('close', (code) => {
      if (code !== 0) {
        stream.emit('error', new Error('fpcalc failed'));
      }
  
      stream.queue(null);
    });
  
    return stream;
  }
}

export default AcousticId;
