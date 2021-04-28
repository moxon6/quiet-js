import Module from './build';
import Quiet from './quiet';

export * from './utils';

export default async function(audioContext, modulePath) {
    const wasmModule = await (
        modulePath 
            ? Module({ locateFile: () => modulePath })
            : Module()
    );
    return new Quiet(audioContext, wasmModule);
}
