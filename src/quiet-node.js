import fs from 'fs';
import importObject from './importObject';
import createQuiet from './quiet';
import { copyToChannel } from './node-polyfill';

async function instantiateNode() {
  const module = await WebAssembly.compile(fs.readFileSync(new URL('../quiet.wasm', import.meta.url)));
  const instance = await WebAssembly.instantiate(module, importObject);
  return { module, instance };
}

export default createQuiet({
  instantiateNode,
  copyToChannel: (...args) => copyToChannel.apply(this, args),
});
