import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {ReactNode} from "react";



export const DropMenus = ({trigger, items}: {
    trigger: ReactNode;
    items: any[];
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {trigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                {
                    items.map(item => {
                        return (
                            <DropdownMenuItem key={item.value} onClick={item.onClick}>
                                {item.label}
                            </DropdownMenuItem>
                        )
                    })
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}