import Module from './build';
import Quiet from './quiet';

export * from './utils';

export default async function(profiles, audioContext, modulePath) {
    const wasmModule = await Module({
        locateFile: () => modulePath,
    });
    return new Quiet(profiles, audioContext, wasmModule);
}
