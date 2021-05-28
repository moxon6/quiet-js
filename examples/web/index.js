/* eslint-disable import/no-unresolved */
import Quiet, { quietProfiles } from '@moxon6/quiet-js';

const audioContext = new AudioContext();

async function main() {
  const quiet = await new Quiet(
    audioContext,
    quietProfiles.audible,
  ).init();

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
