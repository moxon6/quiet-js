/* eslint-disable import/no-unresolved */
import quietWasm from 'url:../../quiet.wasm';
import quietWorkletPath from 'url:../../dist/quiet-worklet.js';
import quietProfiles from '../../quiet-profiles.json';
import Quiet from '../../dist/index.js';

const audioContext = new AudioContext();

async function main() {

  const quietWasmBytes = await fetch(quietWasm)
    .then(res => res.arrayBuffer())

  const quiet = await new Quiet(
    audioContext,
    quietWasmBytes,
    quietProfiles.audible,
    quietWorkletPath,
  ).init()

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

  const received = document
    .querySelector('#received-text');

  document
    .querySelector('#start-listening')
    .addEventListener('click', () => {
      quiet.receive((data) => {
        received.innerHTML += data.value;
      });
    });
}

main();
