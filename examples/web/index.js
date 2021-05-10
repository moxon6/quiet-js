// TODO: Fix
/* eslint-disable import/no-unresolved */
import quietWasm from 'url:../../quiet.wasm';
import quietWorkletPath from 'url:../../dist/quiet-worklet.js';
import quietProfiles from '../../quiet-profiles.json';
import quietjs from '../../dist/index.js';

const audioContext = new AudioContext();

console.log(quietWorkletPath);

async function main() {
  const quiet = await quietjs(
    audioContext,
    fetch(quietWasm),
    quietProfiles.audible,
    quietWorkletPath,
    quietWasm,
  );

  function sendText(payload) {
    quiet.transmit({
      clampFrame: false,
      payload,
    });
  }

  document
    .querySelector('#audible-text')
    .addEventListener('submit', (e) => {
      const { value } = e.target.querySelector('textarea');
      sendText(value);
      e.preventDefault();
    });

  quiet.receive();
}

main();

const getUserAudio = async () => navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: false,
  },
});

window.receive = async function receive() {
  const quietWasmResponse = await this.quietWasmBinary;
  const bytes = await quietWasmResponse.arrayBuffer();

  await this.audioContext.audioWorklet.addModule(this.workletPath);
  const whiteNoiseNode = new AudioWorkletNode(audioContext, 'white-noise-processor', {
    processorOptions: {
      bytes,
      profile: this.profile,
      sampleRate: this.audioContext.sampleRate,

    },
  });

  this.audioStream = await getUserAudio();
  const audioInput = this.audioContext.createMediaStreamSource(this.audioStream);
  audioInput
    .connect(whiteNoiseNode);
};
