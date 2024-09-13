import {hash} from "starknet";
import {Contract} from "@/types";

export async function genContractData (
    contractName: string,
    compileResult: string,
): Promise<Partial<Contract> | null> {
    const data = JSON.parse(compileResult)
    // const sierra = data.sierra_program;
    // const casm = await JSON.parse(casmFile)
    // const compiledClassHash = hash.computeCompiledClassHash(casm)
    const classHash = hash.computeContractClassHash(data)
    const sierraClassHash = hash.computeSierraContractClassHash(data)

    const contract = {
        name: contractName,
        abi: data.abi,
        // compiledClassHash,
        classHash,
        sierraClassHash,
        sierra: data,
        // casm,
        // path,
        compileInfo: compileResult,
        deployedInfo: [],
        address: '',
        declaredInfo: []
    }

    return contract
}