import Quiet from './quiet';

export * from './utils';

export default async function(audioContext, quietWasm) {
    const instance = await getInstance(quietWasm);
    return new Quiet(audioContext, instance);
}
