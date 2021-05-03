import Quiet from './quiet';

export * from './utils';

export default async function(audioContext, wasmModule) {
    return new Quiet(audioContext, wasmModule);
}
