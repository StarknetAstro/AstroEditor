import {Button} from "@/components/ui/button";
import {Cog, Files, Info} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {Tooltip} from "@/components/Tooltip";
import logo from "@/assets/logo.png";

enum PageEnum {
    EDITOR = "editor",
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
        value: PageEnum.EDITOR,
        label: 'Files',
        icon: <Files size={24}/>
    },
    {
        value: PageEnum.SETTING,
        label: 'Setting',
        icon: <Cog size={24}/>
    },
    {
        value: PageEnum.ABOUT,
        label: 'About',
        icon: <Info size={24}/>
    }
]


export const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    console.log(pathname)
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
                                    <Tooltip content={<p>{item.label}</p>}>
                                        <Button size="icon" key={index} variant={`/${item.value}` === pathname ? 'secondary' : 'ghost'} className="w-12 justify-center" onClick={() => router.push(item.value)}>
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
