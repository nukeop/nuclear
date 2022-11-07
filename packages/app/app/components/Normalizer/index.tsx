/*
  Adapted from https://github.com/est31/js-audio-normalizer

  The MIT License (MIT)
  Permission is hereby granted, free of charge, to any
  person obtaining a copy of this software and associated
  documentation files (the "Software"), to deal in the
  Software without restriction, including without
  limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software
  is furnished to do so, subject to the following
  conditions:

  The above copyright notice and this permission notice
  shall be included in all copies or substantial portions
  of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
  ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
  TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT
  SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
  DEALINGS IN THE SOFTWARE.
*/

import { pluginFactory } from 'react-hifi';
import { Plugin } from 'react-hifi/dist/types/plugins/Plugin';

export interface NormalizerProps {
  /** url of stream that is played */
  url: string;
  normalize: boolean;
}

export class Normalizer implements Plugin<NormalizerProps, GainNode> {
  private audioContext: AudioContext;
  constructor() {
    this.createNode = this.createNode.bind(this);
  }

  shouldNotUpdate(prevProps: NormalizerProps, nextProps: NormalizerProps) {
    return prevProps.url === nextProps.url;
  }

  normalizeTrack = (gainNode: GainNode, url: string, normalize) => {
    if (!normalize) {
      gainNode.gain.value = 1;
      return;
    }

    // delay workaround with suspending audiocontext until fetch is finished
    this.audioContext.suspend();

    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
      // use ArrayBuffer
        this.audioContext.decodeAudioData(arrayBuffer).then((audioBuffer) => {
        // use AudioBuffer

          // perform calculations on audio data
          const decodedBuffer = audioBuffer.getChannelData(0);
          const sliceLen = Math.floor(audioBuffer.sampleRate * 0.05);
          const averages = [];
          let sum = 0.0;
          for (let i = 0; i < decodedBuffer.length; i++) {
            sum += decodedBuffer[i] ** 2;
            if (i % sliceLen === 0) {
              sum = Math.sqrt(sum / sliceLen);
              averages.push(sum);
              sum = 0;
            }
          }

          // get average
          sum = 0;
          for (let i = 0; i< averages.length; i++){
            sum += averages[i];
          }
          const a = sum/averages.length;

          let gain = 1.0 / a;
          // Perform some clamping
          gain = Math.max(gain, 0.02);
          gain = Math.min(gain, 100.0);

          // ReplayGain uses pink noise for this one one but we just take
          // some arbitrary value... we're no standard
          // Important is only that we don't output on levels
          // too different from other websites
          gain = gain / 10.0;

          // round the float value to 3 decimal places

          gain = parseFloat(gain.toFixed(3));

          gainNode.gain.value = gain;
          this.audioContext.resume();
        });
      });
  }

  createNode = (audioContext: AudioContext, { url, normalize }: NormalizerProps) => {
    this.audioContext = audioContext;
    const gainNode = audioContext.createGain();
    this.normalizeTrack(gainNode, url, normalize);
    return gainNode;
  }

  updateNode = (node: GainNode, {url, normalize}: NormalizerProps) => {
    this?.normalizeTrack(node, url, normalize);
  }
}

export default pluginFactory<NormalizerProps, GainNode>(new Normalizer());
