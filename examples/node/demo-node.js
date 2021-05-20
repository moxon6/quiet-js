import Quiet from '@moxon6/quiet-js';
import '@moxon6/quiet-js/node-polyfill.js';
import Speaker from 'speaker';
import { readFile } from 'fs/promises';

async function configureQuiet(quietProfiles) {
  const quietWasm = './node_modules/@moxon6/quiet-js/quiet.wasm';
  const quietWorklet = './node_modules/@moxon6/quiet-js/dist/quiet-worklet.js';
  const quietWasmBytes = await readFile(quietWasm)

  const audioContext = new AudioContext();

  audioContext.outStream = new Speaker({
    channels: audioContext.format.numberOfChannels,
    bitDepth: audioContext.format.bitDepth,
    sampleRate: audioContext.sampleRate,
  });

  return await new Quiet(
    audioContext,
    quietWasmBytes,
    quietProfiles.audible,
    quietWorklet,
  ).init();
}

async function getProfiles() {
  const quietProfilesString = await readFile('node_modules/@moxon6/quiet-js/quiet-profiles.json');
  return JSON.parse(quietProfilesString);
}

async function main() {
  const profiles = await getProfiles();
  const quiet = await configureQuiet(profiles);

  setInterval(() => {
    quiet.transmit({
      profile: profiles.audible,
      clampFrame: false,
      payload: 'This is an example \n',
    });
  }, 2000);
}

main();
