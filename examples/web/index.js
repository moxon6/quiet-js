import quietjs from '@moxon6/quiet-js';
import quietProfiles from '@moxon6/quiet-js/quiet-profiles.json';
import quietWasm from 'url:@moxon6/quiet-js/quiet.wasm';

const audioContext = new AudioContext();

async function main() {
  const quiet = await quietjs(
    audioContext,
    fetch(quietWasm),
  );

  function sendText(payload) {
    quiet.transmit({
      profile: quietProfiles.audible,
      clampFrame: false,
      payload,
    });
  }

  document
    .querySelector("#audible-text")
    .addEventListener("submit", e => {
      const value = e.target.querySelector("textarea").value
      sendText(value)
      e.preventDefault()
    })
}

main();
