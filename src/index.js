import Quiet from './quiet.js';

import importObject from './importObject.js';

export default async function createQuiet(
  audioContext,
  quietWasm,
  profile,
  quietWorletPath,
  quietWasmPath,
) {
  const instantiate = quietWasm instanceof Promise
    ? WebAssembly.instantiateStreaming
    : WebAssembly.instantiate;

  const { instance } = await instantiate(quietWasm, importObject);
  return new Quiet(audioContext, instance, profile, quietWorletPath, quietWasmPath);
}
