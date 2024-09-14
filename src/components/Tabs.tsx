import { TabsProps } from '@radix-ui/react-tabs';
import { cn } from '../lib/utils';
import { Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { MouseEvent, MouseEventHandler, ReactNode } from "react";

interface ITabItem {
    value: string;
    label: ReactNode;
    content: ReactNode;
}

interface ITabsProps extends TabsProps {
    items: ITabItem[];
    className?: string;
    extra?: ReactNode;
}

export function Tab({
                                children,
                                creating = false,
                                saved = true,
                                selected = false,
                                onClick,
                                onClose,
                                closing = false,
    closable=true
                            }: {
    children: React.ReactNode;
    creating?: boolean;
    saved?: boolean;
    selected?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    onClose?: () => void;
    closing?: boolean;
    closable?: boolean;
}) {
    return (
        <Button
            onClick={onClick ?? undefined}
            size="sm"
            variant={"secondary"}
            className={`font-normal select-none ${
                selected
                    ? "bg-neutral-700 hover:bg-neutral-600 text-foreground"
                    : "text-muted-foreground"
            }`}
        >
            {children}
            {
                closable ? <div
                    onClick={
                        onClose && !closing
                            ? (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onClose();
                            }
                            : undefined
                    }
                    className="h-5 w-5 ml-0.5 group flex items-center justify-center translate-x-1 transition-colors bg-transparent hover:bg-muted-foreground/25 cursor-pointer rounded-sm"
                >
                    {closing || creating ? (
                        <Loader2 className="animate-spin w-3 h-3"/>
                    ) : saved ? (
                        <X className="w-3 h-3"/>
                    ) : (
                        <>
                            <X className="w-3 h-3 group-hover:block hidden"/>
                            <div className="w-2 h-2 rounded-full bg-foreground group-hover:hidden"/>
                        </>
                    )}
                </div> : null
            }
        </Button>
    );
}


export const Tabs = (props: ITabsProps) => {
    const {items, className, extra, ...others} = props;

    return (
        <div>
            <div className="space-between flex items-center">
                <div className={cn('p-0 h-auto overflow-hidden', className)}>
                    {items?.map((item) => {
                        return (
                            <Tab
                                key={item.value}
                            >
                                {item.label}
                            </Tab>
                        );
                    })}
                </div>
                {extra}
            </div>

            {items?.map((item) => {
                return (
                    <div key={item.value}>
                        {item.content}
                    </div>
                );
            })}
        </div>
    );
};
