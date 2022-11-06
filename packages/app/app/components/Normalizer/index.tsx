import { pluginFactory, Plugin } from 'react-hifi';

export interface NormalizerProps {
  /** url of stream that is played */
  url: string;
  normalize: boolean;
}

export class Normalizer implements Plugin<NormalizerProps, GainNode> {
  constructor() {
    this.createNode = this.createNode.bind(this);
  }

  shouldNotUpdate(prevProps: NormalizerProps, nextProps: NormalizerProps) {
    return prevProps.url === nextProps.url;
  }

  createNode(audioContext: AudioContext, { url, normalize }: NormalizerProps) {
    const gainNode = audioContext.createGain();

    if (!normalize) {
      gainNode.gain.value = 1;
      return gainNode;
    }

    // delay workaround with suspending audiocontext until fetch is finished
    audioContext.suspend();

    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        // use ArrayBuffer
        audioContext.decodeAudioData(arrayBuffer).then((audioBuffer) => {
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

          this.updateNode(gainNode, gain);
          audioContext.resume();
        });
      });
    return gainNode;
  }

  updateNode(node: GainNode, gainValue: number) {
    if (isFinite(gainValue)) {
      node.gain.value = gainValue;
    }
  }
}

export default pluginFactory<NormalizerProps, GainNode>(new Normalizer());
