import Module from './build';
import Quiet from './quiet';

export * from './utils';

export default async function(profiles, audioContext, modulePath) {
    const wasmModule = await (
        modulePath 
            ? Module({ locateFile: () => modulePath })
            : Module()
    );
    return new Quiet(profiles, audioContext, wasmModule);
}
