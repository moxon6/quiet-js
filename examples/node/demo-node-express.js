import '@moxon6/quiet-js/node-polyfill.js';
import quietjs from '@moxon6/quiet-js';
import Speaker from 'speaker';
import { readFile } from 'fs/promises';
import express from 'express';

async function configureQuiet() {
  const quietWasm = './node_modules/@moxon6/quiet-js/quiet.wasm';
  const wasm = await readFile(quietWasm);

  const audioContext = new AudioContext();

  audioContext.outStream = new Speaker({
    channels: audioContext.format.numberOfChannels,
    bitDepth: audioContext.format.bitDepth,
    sampleRate: audioContext.sampleRate,
  });

  return await quietjs(
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

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post('/output', (req, res) => {
    const payload = req.body.message;
    console.log(`Encoding: "${payload}"`);
    quiet.transmit({
      profile: profiles.audible,
      clampFrame: false,
      payload,
    });
    res.send('');
  });

  app.listen(3000);
}

main();
