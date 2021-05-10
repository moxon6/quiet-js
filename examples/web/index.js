// TODO: Fix
/* eslint-disable import/no-unresolved */
import quietWasm from 'url:../../quiet.wasm';
import quietWorletPath from 'url:../../src/quiet-worklet.js';
import quietProfiles from '../../quiet-profiles.json';
import quietjs from '../../src/index';

const audioContext = new AudioContext();

async function main() {
  const quiet = await quietjs(
    audioContext,
    fetch(quietWasm),
    quietWorletPath,
    quietWasm,
  );

  function sendText(payload) {
    quiet.transmit({
      profile: quietProfiles.audible,
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

window.receive = async function receive() {
  const quietWasmResponse = await this.quietWasmBinary;
  const bytes = await quietWasmResponse.arrayBuffer();

  await this.audioContext.audioWorklet.addModule(this.workletPath);
  const whiteNoiseNode = new AudioWorkletNode(audioContext, 'white-noise-processor', {
    processorOptions: {
      bytes,
    },
  });
  whiteNoiseNode.connect(audioContext.destination);

  whiteNoiseNode.port.postMessage({ loadWasm: this.quietWasmPath });
};
