import { TabsProps } from '@radix-ui/react-tabs';
import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { TabsContent, Tabs as TabsCore, TabsList, TabsTrigger } from './ui/tabs';

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

export const Tabs = (props: ITabsProps) => {
    const { items, className, extra, ...others } = props;

    return (
        <TabsCore defaultValue={items[0]?.value} {...others}>
            <div className="space-between flex items-center">
                <TabsList className={cn('p-0 h-auto overflow-hidden', className)}>
                    {items?.map((item) => {
                        return (
                            <TabsTrigger
                                key={item.value}
                                value={item.value}
                                className={'bg-transparent rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground'}
                            >
                                {item.label}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                {extra}
            </div>

            {items?.map((item) => {
                return (
                    <TabsContent key={item.value} value={item.value}>
                        {item.content}
                    </TabsContent>
                );
            })}
        </TabsCore>
    );
};
