'use client';

import {cn} from "@/lib/utils";
import {Link, useLocation} from "react-router-dom";

const menus = [
    // {
    //     name: 'Swap',
    //     path: '/swap'
    // },
    {
        name: 'Friend',
        path: '/friend'
    },
]

export function MainNav({
                            className,
                            ...props
                        }: React.HTMLAttributes<HTMLElement>) {
    const {pathname} = useLocation();
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            {
                menus.map((menu) => {
                    return (
                        <Link
                            to={menu.path}
                            key={menu.path}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === menu.path ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            {menu.name}
                        </Link>
                    )
                })
            }
        </nav>
    )
}