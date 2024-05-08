import {useEffect, useRef} from "react";
import * as Comlink from "comlink";
import {useMutation} from "@tanstack/react-query";
import {CairoWorker} from "../../worker";


export const useCairoWasm = () => {
    const workerRef = useRef<CairoWorker>();

    const initWorker = async () => {
        const CairoWorkerWrap = Comlink.wrap<CairoWorker>(new Worker(new URL('../../worker.ts', import.meta.url)));
        // @ts-ignore
        const worker = await new CairoWorkerWrap();
        console.log(worker, 'wrorker')
        workerRef.current = worker;
    }

    useEffect(() => {
        initWorker();
    }, []);

    const { mutateAsync: runCairo, isPending: runLoading } = useMutation({
        mutationKey: ['runCairoProgram'],
        mutationFn: (params: any) => workerRef.current!.runCairoProgram(params),
    })

    const { mutateAsync: compileCairo, isPending: compileCairoLoading } = useMutation({
        mutationKey: ['compile-cairo'],
        mutationFn: (params: any) => workerRef.current!.compileCairoProgram(params),
    })

    const { mutateAsync: compileContract, isPending: compileContractLoading } = useMutation({
        mutationKey: ['compile-contract'],
        mutationFn: (params: any) => workerRef.current!.compileStarknetContract(params),
    })

    const { mutateAsync: runTests, isPending: testLoading } = useMutation({
        mutationKey: ['compile-contract'],
        mutationFn: (params: any) => workerRef.current!.runTests(params),
    })

    return {
        runCairo,
        compileCairo,
        runLoading,
        compileLoading: compileCairoLoading || compileContractLoading,
        compileContract,
        runTests,
        testLoading
    }
}