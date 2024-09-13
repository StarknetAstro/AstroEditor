
'use client';
import {ReactNode} from "react";
import {SideBar} from "@/components/SideBar";
import {StarknetProvider} from "@/components/StarkProvider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const queryClient = new QueryClient()

export default function Home({children}: {children: ReactNode}) {

    return (
        <StarknetProvider>
            <QueryClientProvider client={queryClient}>
                <div className={'p-0 h-[100vh]'}>
                    <div className="editor flex flex-1">
                        <SideBar/>
                        <div className="main flex-1 min-w-0">
                            {children}
                        </div>
                    </div>
                </div>
            </QueryClientProvider>
        </StarknetProvider>
    )
}