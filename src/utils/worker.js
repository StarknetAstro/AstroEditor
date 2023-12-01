import wasm_bindgen, { greet, compileCairoProgram, runCairoProgram, compileStarknetContract } from '@/pkg/wasm-cairo';

const url = new URL('/wasm-cairo_bg.wasm', import.meta.url).href;

(async () => {
    await wasm_bindgen(url)

    console.log(greet("StarknetAstro"))
})();

onmessage = function (e) {
    const { data, functionToRun, replaceIds } = e.data;
    wasm_bindgen(url).then(() => {
        let result;
        switch (functionToRun) {
            case "runCairoProgram":
                const { availableGas, printFullMemory, useDBGPrintHint } = e.data;
                result = runCairoProgram(data, availableGas, printFullMemory, useDBGPrintHint);
                break;
            case "compileCairoProgram":
                result = compileCairoProgram(data, replaceIds);
                break;
            case "compileStarknetContract":
                result = compileStarknetContract(data, replaceIds);
                break;
            default:
                console.error(`Unexpected function: ${functionToRun}`);
                return;
        }
        console.log("text: " + result)
        postMessage(result);
    });
}