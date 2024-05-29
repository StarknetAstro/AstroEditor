import {TooltipContent, TooltipProvider, TooltipTrigger, Tooltip as TooltipCore} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {ReactNode} from "react";

export const Tooltip = ({children, content}:{children: ReactNode; content: ReactNode}) => {
    return (
        <TooltipProvider>
            <TooltipCore>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    {content}
                </TooltipContent>
            </TooltipCore>
        </TooltipProvider>
    )
}