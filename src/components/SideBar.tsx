import {Button} from "@/components/ui/button";
import {Cog, Files, Info, SquareCode} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Tooltip} from "@/components/Tooltip";
import logo from "@/assets/logo.png";
import {createQueryString} from "@/utils/common";

export enum PageEnum {
    EDITOR = "editor",
    DEPLOY = 'deploy',
    SETTING = "setting",
    ABOUT = "about"
}

enum TabEnum {
    COMPILETAB = 'COMPILETAB',
    RUNTAB = "RUNTAB",
    TESTTAB = "TESTTAB"
}

const pages = [
    {
        value: '',
        label: 'Files',
        icon: <Files size={18}/>
    },
    // {
    //     value: PageEnum.DEPLOY,
    //     label: 'Deploy',
    //     icon: <SquareCode size={24}/>
    // },
    {
        value: PageEnum.SETTING,
        label: 'Setting',
        icon: <Cog size={18}/>
    },
    {
        value: PageEnum.ABOUT,
        label: 'About',
        icon: <Info size={18}/>
    }
]


export const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') as TabEnum;
    console.log(pathname)

    const handleClick = (v: string) => {
        // const params = createQueryString(searchParams, 'tab', v);
        router.push(v);
    };

    return (
        <div className={"pb-12 hidden md:block border-r h-[100vh]"}>
            <div className={'text-center py-4 flex justify-center'}>
                <a href="https://github.com/StarknetAstro/AstroEditor" target={'_blank'}>
                    <img src={logo.src} className={'w-10 rounded-lg'} alt=""/>
                </a>
            </div>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex flex-col gap-4">
                        {
                            pages.map((item, index) => {
                                return (
                                    <Tooltip content={<p>{item.label}</p>} key={index}>
                                        <Button size="icon" variant={`/${item.value}` === pathname ? 'secondary' : 'ghost'} className="w-12 justify-center" onClick={() => handleClick(item.value)}>
                                            {item.icon}
                                        </Button>
                                    </Tooltip>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
