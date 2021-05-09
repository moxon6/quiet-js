import '@moxon6/quiet-js/node-polyfill.js';
import quietjs from '@moxon6/quiet-js';
import Speaker from 'speaker';
import { readFile } from 'fs/promises';

async function configureQuiet() {
  const quietWasm = './node_modules/@moxon6/quiet-js/quiet.wasm';
  const wasm = await readFile(quietWasm);

  const audioContext = new AudioContext();

  audioContext.outStream = new Speaker({
    channels: audioContext.format.numberOfChannels,
    bitDepth: audioContext.format.bitDepth,
    sampleRate: audioContext.sampleRate,
  });

  return quietjs(
    audioContext,
    wasm,
  );
}

async function getProfiles() {
  const quietProfilesString = await readFile('node_modules/@moxon6/quiet-js/quiet-profiles.json');
  return JSON.parse(quietProfilesString);
}

async function main() {
  const quiet = await configureQuiet();
  const profiles = await getProfiles();

  setInterval(() => {
    quiet.transmit({
      profile: profiles.audible,
      clampFrame: false,
      payload: 'This is an example \n',
    });
  }, 2000);
}

main();
