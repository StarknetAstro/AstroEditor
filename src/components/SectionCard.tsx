import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ReactNode} from "react";


export const SectionCard = ({title, children, className}: {title: ReactNode; children: ReactNode; className?: string}) => {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className={'text-md'}>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}