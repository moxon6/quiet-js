import Quiet from './quiet';
import getInstance from './build'

export default async function(audioContext, quietWasm) {
    const instance = await getInstance(quietWasm);
    return new Quiet(audioContext, instance);
}
