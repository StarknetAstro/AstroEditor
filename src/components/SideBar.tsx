import {Button} from "@/components/ui/button";
import {Codesandbox, Cog, Info} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";

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
        label: 'Editor',
        icon: <Codesandbox className="mr-2 h-4 w-4"/>
    },
    {
        value: PageEnum.SETTING,
        label: 'Setting',
        icon: <Cog className="mr-2 h-4 w-4"/>
    },
    {
        value: PageEnum.ABOUT,
        label: 'About',
        icon: <Info className="mr-2 h-4 w-4"/>
    }
]


export const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    console.log(pathname)
    return (
        <div className={"pb-12 hidden md:block"}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {
                            pages.map((item, index) => {
                                return (
                                    <Button key={index} variant={`/${item.value}` === pathname ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => router.push(item.value)}>
                                        {item.icon}
                                        {item.label}
                                    </Button>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
