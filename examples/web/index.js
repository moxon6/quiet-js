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
