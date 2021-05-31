import importObject from './importObject';
import createQuiet from './quiet';

async function instantiateWeb() {
  const { module, instance } = await WebAssembly.instantiateStreaming(
    fetch(new URL('../quiet.wasm', import.meta.url)),
    importObject,
  );
  return { module, instance };
}

export default createQuiet({
  instantiate: instantiateWeb,
  copyToChannel: (audioBuffer, ...args) => audioBuffer.copyToChannel(...args),
});
