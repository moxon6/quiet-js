import Quiet from './quiet.js';

import importObject from './importObject';

export default async function createQuiet(audioContext, quietWasm, quietWorletPath, quietWasmPath) {
  const instantiate = quietWasm instanceof Promise
    ? WebAssembly.instantiateStreaming
    : WebAssembly.instantiate;

  const { instance } = await instantiate(quietWasm, importObject);
  return new Quiet(audioContext, instance, quietWorletPath, quietWasmPath);
}
