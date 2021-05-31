import webAudioApi from 'web-audio-api';

const { AudioContext, AudioBufferSourceNode, AudioBuffer } = webAudioApi;

global.AudioContext = AudioContext;
global.AudioBufferSourceNode = AudioBufferSourceNode;
global.AudioBuffer = AudioBuffer;

// eslint-disable-next-line import/prefer-default-export
export function copyToChannel(
  source,
  channelNumber,
  startInChannel,
) {
  if (channelNumber > this.numberOfChannels) {
    throw new Error('INDEX_SIZE_ERR');
  }

  if (startInChannel > this.length) {
    throw new Error('INDEX_SIZE_ERR');
  }

  this.getChannelData(channelNumber).set(
    source.subarray(0, Math.min(source.length, this.length)),
    startInChannel,
  );
}
