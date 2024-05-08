'use client';
import {Tabs} from "@/components/Tabs";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {checkIsContract, displayTimeByTimeStamp} from "@/utils/common";
import {useSettingStore} from "@/stores/setting";
import {useAccount} from "@starknet-react/core";
import {useCairoWasm} from "@/hooks/useCairoWasm";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function Editor() {
    const [textValues, setTextValues] = useState<string[]>([]);
    const [active, setActive] = useState(0);
    const { isReplaceIds,  availableGas, printFullMemory, useCairoDebugPrint } = useSettingStore();
    const [compileResult, setCompileResult] = useState<string>("");
    const [tabs, setTabs] = useState([
        {
            value: 0,
            label: 'Default',
        }
    ]);
    const [logs, setLogs] = useState<{
        timestamp: number,
        message: string
    }[]>([]);
    const { account } = useAccount();
    const { compileCairo, compileContract, compileLoading, runCairo, runLoading, testLoading, runTests} = useCairoWasm();

    console.log(account, 'acc')


    useEffect(() => {
        fetch('HelloStarknetAstro.cairo')
            .then(response => response.text())
            .then(data => {
                console.log(data);
                setTextValues([data]);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleCompile = async () => {
        //get textarea cairo_program's value
        const cairo_program = textValues[active];
        console.log(textValues, active, cairo_program);
        if (!cairo_program) {
            return;
        }
        if (checkIsContract(cairo_program)) {
            const res = await compileContract({starknetContract: cairo_program, replaceIds: isReplaceIds, allowWarnings: true});
            console.log(res, 'res');
            setCompileResult(res as string);
            setLogs([
                ...logs,
                {
                    timestamp: Date.now(),
                    message: res as string,
                }
            ])
        } else {
            const res = await compileCairo({cairoProgram: cairo_program, replaceIds: isReplaceIds});
            console.log(res, 'res');
            setCompileResult(res as string);
            setLogs([
                    ...logs,
                {
                    timestamp: Date.now(),
                    message: res as string,
                }
            ])
        }
    }

    const handleRun = async () => {
        //get textarea cairo_program's value
        const cairo_program = textValues[active];
        if (!cairo_program) {
            return;
        }
        const gasValue = availableGas;
        const res = await runCairo({
            cairoProgram: cairo_program,
            replaceIds: isReplaceIds,
            availableGas: gasValue == "" ? undefined : parseInt(gasValue),
            printFullMemory: printFullMemory,
            useDBGPrintHint: useCairoDebugPrint,
        });
        console.log(res, 'res');
        setLogs([
            ...logs,
            {
                timestamp: Date.now(),
                message: res as string,
            }
        ]);
    }

    const handleRunTest = async () => {
        const cairo_program = textValues[active];
        if (!cairo_program) {
            return;
        }
        const res = await runTests({
            cairoProgram: cairo_program,
        });
        console.log(res, 'res');
        setLogs([
            ...logs,
            {
                timestamp: Date.now(),
                message: res as string,
            }
        ]);
    }

    const addTab = () => {
        setTabs([
            ...tabs,
            {
                value: tabs.length,
                label: 'New File',
            }
        ]);
        setTextValues([...textValues, ''])
    }

    const setTextValueByIndex = (index: number, value: string) => {
        setTextValues(textValues?.map((item, i) => {
            return i === index ? value : item;
        }))
    }

    const handleOpenFile = (e: any) => {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                setTextValueByIndex(active, e.target?.result as string);
            }
            reader.readAsText(file);
        }
    }

    const saveFile = async (fileName: string, content: string, isComplied?: boolean) => {
        if(content == "") {
            return;
        }

        let options = {};

        if(isComplied) {
            options = {
                suggestedName: 'astro_compiled.sierra',
                types: [{
                    description: 'Sierra File',
                    accept: { 'text/plain': ['.sierra'] },
                }],
            };
            if(content.includes("sierra_program")) {
                options = {
                    suggestedName: 'astro_compiled.json',
                    types: [{
                        description: 'JSON File',
                        accept: { 'text/plain': ['.json'] },
                    }],
                };
            }
        } else {
            options = {
                suggestedName: fileName,
                types: [{
                    description: 'File',
                    accept: { 'text/plain': ['.cairo'] },
                }],
            };
        }

        const fileHandle = await (window as any).showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        alert("File has been saved.");
    }
    return (
        <div id="Code" className="h-full flex flex-col">
            <div className="">
                <Tabs value={String(active)} onValueChange={(v) => setActive(Number(v))}
                      items={tabs.map((tab, index) => {
                          return {
                              value: String(tab.value),
                              label: tab.label,
                              content: <div className="tabs-content">
                                  {/*Tab content will be added here dynamically*/}
                                  <Textarea id="cairo_program" value={textValues[index]}
                                            onChange={e => setTextValueByIndex(index, e.target.value)}
                                            className="codeEditor active h-[40vh]"></Textarea>
                              </div>
                          }
                      })}
                      extra={<div className="ml-auto mr-4">
                          <Button onClick={addTab}>
                              <PlusCircleIcon className="mr-2 h-4 w-4"/>
                              Add
                          </Button>
                      </div>}
                />
            </div>
            <div className="toolbar flex justify-between gap-4 my-5">
                <div className="flex gap-4">
                    <Button onClick={handleCompile} loading={compileLoading}>Compile</Button>
                    <Button onClick={handleRun} loading={runLoading}>Run Cairo</Button>
                    <Button onClick={handleRunTest} loading={testLoading}>Run Test</Button>
                </div>
                <div className="md:flex gap-4 hidden">
                    <div className={'relative'}>
                        <Button id="open-file-button" variant={'outline'}>Open File</Button>
                        <input type="file" onChange={handleOpenFile}
                               className={'cursor-pointer absolute top-0 left-0 w-full h-full opacity-0'}/>
                    </div>
                    <Button variant={'outline'} className="file-button"
                            onClick={() => saveFile('astro.cairo', textValues[active])}>Save source code</Button>
                </div>
            </div>
            <div className="mt-4 flex-1">
                <div className="flex justify-between items-center py-2">
                    <div className={'border-b border-primary'}>
                        Output
                    </div>
                    <Button variant={'outline'} className="ml-auto mr-2"
                            onClick={() => saveFile('astro_compiled.sierra', compileResult, true)}>Save
                        compiled
                        file
                    </Button>
                </div>
                <div>
                    <ScrollArea className="h-[20vh]">
                        <div className="space-y-4">
                            {
                                logs.map((log, index) => {
                                    return (
                                        <div key={index}>
                                            <div className="text-sm">[{displayTimeByTimeStamp(log.timestamp)}]</div>
                                            <div className="text-sm">{log.message}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}