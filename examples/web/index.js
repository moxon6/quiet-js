// TODO: Fix
/* eslint-disable import/no-unresolved */
import quietWasm from 'url:../../quiet.wasm';
import quietWorkletPath from 'url:../../dist/quiet-worklet.js';
import quietProfiles from '../../quiet-profiles.json';
import quietjs from '../../dist/index.js';

const audioContext = new AudioContext();

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
