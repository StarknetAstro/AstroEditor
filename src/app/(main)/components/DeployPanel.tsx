import ConnectModal from "@/components/ConnectModal";
import {useAccount} from "@starknet-react/core";
import {useContractStore} from "@/stores/contracts";
import {Button} from "@/components/ui/button";
import DisconnectModal from "@/components/DisconnectModal";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {hash} from "starknet";


export const DeployPanel = () => {
    const { account, address } = useAccount();
    const { contracts } = useContractStore();
    const [v, setV] = useState('');

    const [casm, setCasm] = useState('');

    const current = contracts['hello.cairo'];

    console.log(contracts, 'cc')

    const handleDeclare = async () => {
        try {
            console.log(current, 'current')
            const data = JSON.parse(v);
            const classHash = hash.computeContractClassHash(data)
            const compiledClassHash = hash.computeCompiledClassHash(JSON.parse(casm))
            const res = await account?.declare({
                // contract: current?.sierra,
                // classHash: current?.classHash,
                contract: data, //current?.sierra,
                classHash: classHash,
                compiledClassHash: compiledClassHash,
            }, {
                maxFee: 3e18
            });
            console.log(res, 'res');
        } catch (e) {
            console.error(e);
        }
    }
    return (
        <div className="p-6 flex-[0_0_280px]">
            <div className={'flex justify-between items-center'}>
                <div className={'text-lg font-bold'}>Deploy</div>
                <div>
                    {address ? <DisconnectModal/> : <ConnectModal/>}
                </div>
            </div>
            <div className="space-y-6">
                <div className={'mt-8'}>
                    <Button onClick={handleDeclare}>Declare</Button>
                </div>

                <Textarea value={v} onChange={e => setV(e.target.value)}/>

                <Textarea value={casm} onChange={e => setCasm(e.target.value)}/>
            </div>
        </div>
    )
}