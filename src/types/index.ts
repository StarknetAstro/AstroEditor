import {Abi, CairoAssembly, constants} from "starknet";

export interface Contract {
    name: string
    compiledClassHash: string
    classHash: string
    sierraClassHash: string
    sierra: any // CompiledSierra
    casm: CairoAssembly
    abi: Abi
    path: string
    deployedInfo: Array<{
        address: string
        chainId: constants.StarknetChainId
    }>
    declaredInfo: Array<{
        chainId: constants.StarknetChainId
        env: string
    }>
    address: string
}