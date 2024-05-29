import wasmCairo, { compileStarknetContract, runTests, runCairoProgram, compileCairoProgram, greet } from 'wasm-cairo';
import * as Comlink from 'comlink';

interface ITestOptions {
    cairoProgram: string;
    allowWarnings: boolean;
    filter: string;
    includeIgnored: boolean;
    ignored: boolean;
    starknet: boolean;
    runProfiler: string;
    gasDisabled: boolean;
    printResourceUsage: boolean;
}

class CairoWorker {
    init = async () => {
        await wasmCairo();
        greet('Hello World');
    }
    constructor() {
        this.init();
    }

    async runCairoProgram({cairoProgram, availableGas, printFullMemory, useDBGPrintHint, allWarnings = true, runProfiler = false}: any) {
        const res = runCairoProgram(cairoProgram, availableGas, allWarnings, printFullMemory, runProfiler, useDBGPrintHint);
        return res;
    }

    async compileCairoProgram({cairoProgram, replaceIds}: any) {
        const res = compileCairoProgram(cairoProgram, replaceIds);
        return res;
    }
    async compileStarknetContract({starknetContract, allowWarnings, replaceIds}: any) {
        const res = compileStarknetContract(starknetContract, allowWarnings, replaceIds);
        return res;
    }
    async runTests({cairoProgram, allowWarnings = true, filter = '', includeIgnored = true, ignored = true, starknet = false, runProfiler = '', gasDisabled = true, printResourceUsage = true,  }: ITestOptions) {
        const res = runTests(cairoProgram, allowWarnings, filter, includeIgnored, ignored, starknet, runProfiler, gasDisabled, printResourceUsage);
        return res;
    }
}

export {CairoWorker};

Comlink.expose(CairoWorker);