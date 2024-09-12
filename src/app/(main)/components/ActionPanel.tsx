import {useSearchParams} from "next/navigation";
import {PageEnum} from "@/components/SideBar";
import {SettingPanel} from "@/app/(main)/components/SettingPanel";
import {AboutPanel} from "@/app/(main)/components/AboutPanel";
import {DeployPanel} from "@/app/(main)/components/DeployPanel";


export const ActionPanel = () => {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    console.log(tab, 'tt')
    return (
        <div>
            {tab === PageEnum.SETTING ? <SettingPanel/> : null}
            {tab === PageEnum.ABOUT ? <AboutPanel/> : null}
            {tab === PageEnum.DEPLOY ? <DeployPanel/> : null}
        </div>
    )
}