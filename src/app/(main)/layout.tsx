
'use client';
import {ReactNode} from "react";
import {Header} from "@/components/Header";
import {SideBar} from "@/components/SideBar";
import {StarknetProvider} from "@/components/StarkProvider";



export default function Home({children}: {children: ReactNode}) {

    return (
        <StarknetProvider>
            <div className={'p-0 h-[100vh] flex flex-col'}>
                <Header/>
                <div className="editor grid lg:grid-cols-5 flex-1">
                    <SideBar/>
                    <div className="main col-span-3 lg:col-span-4 lg:border-l px-4 pt-6 lg:px-8">
                        {children}
                    </div>
                </div>
            </div>
        </StarknetProvider>
    )
}