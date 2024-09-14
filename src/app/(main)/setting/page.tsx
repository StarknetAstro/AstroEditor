'use client';
import {SectionCard} from "@/components/SectionCard";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Select} from "@/components/Select";
import {Input} from "@/components/ui/input";
import {useSettingStore} from "@/stores/setting";


export default function SettingPanel() {
    const { isReplaceIds, cairoVersion, availableGas, printFullMemory, useCairoDebugPrint, setData } = useSettingStore();

    const setCairoVersion = (v: string) => setData({ cairoVersion: v });

    const setPrintFullMemory = (v: boolean) => setData({ printFullMemory: v });

    const setUseCairoDebugPrint = (v: boolean) => setData({ useCairoDebugPrint: v });

    const setAvailableGas = (v: string) => setData({ availableGas: v });

    const setIsReplaceIds = (v: boolean) => setData({ isReplaceIds: v });

    return (
        <div className="space-y-4 p-6">
            <div className={'text-lg font-bold'}>
                Settings
            </div>
            <SectionCard title="Cairo Compiler settings" className={'space-y-4'}>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={isReplaceIds}
                                  onCheckedChange={(v: boolean) => setIsReplaceIds(v)}/>
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Replace ids
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cairo
                            version:</Label>
                        <Select disabled value={cairoVersion} onChange={setCairoVersion} className={'w-20'} options={[
                            {
                                value: '2.0',
                                label: '2.6.3'
                            },
                            {
                                value: '1.10',
                                label: '1.10'
                            }
                        ]}/>
                    </div>
                </div>
            </SectionCard>
            <SectionCard title={'Cairo VM settings'}>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={printFullMemory}
                                  onCheckedChange={(v: boolean) => setPrintFullMemory(v)}/>
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Print full memory
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" checked={useCairoDebugPrint}
                                  onCheckedChange={(v: boolean) => setUseCairoDebugPrint(v)}/>
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Use Cairo DEBUG Print
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Available Gas:
                        </label>
                        <Input type="number" id="available-gas" className={'w-20'} value={availableGas}
                               onChange={e => setAvailableGas(e.target.value)}/>
                    </div>
                </div>
            </SectionCard>
        </div>
    )
}