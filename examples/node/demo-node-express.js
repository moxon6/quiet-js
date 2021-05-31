import Quiet, { quietProfiles } from '@moxon6/quiet-js';
import Speaker from 'speaker';
import '@moxon6/quiet-js/node-polyfill';
import express from 'express';

async function configureQuiet() {
  const audioContext = new AudioContext();
  audioContext.outStream = new Speaker({
    channels: audioContext.format.numberOfChannels,
    bitDepth: audioContext.format.bitDepth,
    sampleRate: audioContext.sampleRate,
  });

  return new Quiet(
    audioContext,
    quietProfiles.audible,
  ).init();
}

async function main() {
  const quiet = await configureQuiet();

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post('/output', (req, res) => {
    const payload = req.body.message;
    // eslint-disable-next-line no-console
    console.log(`Encoding: "${payload}"`);
    quiet.transmit({
      profile: quietProfiles.audible,
      clampFrame: false,
      payload,
    });
    res.send('');
  });

  app.listen(3000);
}

main();
