import logo from "@/assets/logo.png";
import {ModeToggle} from "@/components/mode-toggle";
import ConnectModal from "@/components/ConnectModal";
import {useAccount} from "@starknet-react/core";
import DisconnectModal from "@/components/DisconnectModal";


export const Header =() => {
    const { address } = useAccount();
    return (
        <div className="flex w-full items-center justify-between px-4 py-4 border-b">
            <div className="flex gap-2 items-center">
                <a href="https://github.com/StarknetAstro/AstroEditor" target={'_blank'}>
                    <img src={logo.src} className={'w-10 rounded-lg'} alt=""/>
                </a>
                <div className="text-primary font-bold text-lg">Astro Editor</div>
            </div>
            <div className="flex gap-2 items-center">
                <ModeToggle/>
                {address ? <DisconnectModal/> : <ConnectModal/>}
            </div>
        </div>
    )
}