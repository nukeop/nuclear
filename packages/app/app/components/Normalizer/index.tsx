import { pluginFactory, Plugin } from 'react-hifi';

export interface NormalizerProps {
  /** url of stream that is played */
  url: string;
}

export class Normalizer implements Plugin<NormalizerProps, GainNode> {
  constructor() {
    this.createNode = this.createNode.bind(this);
  }

  createNode(audioContext: AudioContext, { url }: NormalizerProps) {
    const gainNode = audioContext.createGain();

    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        // use ArrayBuffer
        // console.log(arrayBuffer);
        audioContext.decodeAudioData(arrayBuffer).then((audioBuffer) => {
          // use AudioBuffer
          // console.log(audioBuffer);
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

          averages.sort(function (a, b) {
            return a - b;
          });

          const a = averages[Math.floor(averages.length * 0.95)];

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

        });
      });

    return gainNode;
  }

  /* updateNode(node: GainNode, gainValue: number) {
    console.log("value below");
    console.log(gainValue);
    console.log(isFinite(gainValue));
    node.gain.value = 0.1;
  }*/
}

export default pluginFactory<NormalizerProps, GainNode>(new Normalizer());
