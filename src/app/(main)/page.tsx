'use client';
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
    BugPlay,
    Eraser,
    FileDown,
    FilePlus,
    FlaskConical,
    FolderOpen,
    Hammer,
    Play,
    Rocket,
    Save,
    X
} from "lucide-react";
import {useEffect, useState} from "react";
import {checkIsContract, displayTimeByTimeStamp} from "@/utils/common";
import {useSettingStore} from "@/stores/setting";
import {useAccount} from "@starknet-react/core";
import {useCairoWasm} from "@/hooks/useCairoWasm";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {Editor} from "@monaco-editor/react";
import {Tooltip} from "@/components/Tooltip";
import {ActionPanel} from "@/app/(main)/components/ActionPanel";
import {useContractStore} from "@/stores/contracts";
import {genContractData} from "@/utils/starknet";
import {PageEnum} from "@/components/SideBar";
import {DeployPanel} from "@/app/(main)/components/DeployPanel";

export default function EditorPage() {
    const [enableDeploy, setEnableDeploy] = useState<boolean>(false);
    const [active, setActive] = useState(0);
    const { isReplaceIds,  availableGas, printFullMemory, useCairoDebugPrint } = useSettingStore();
    const [compileResult, setCompileResult] = useState<string>("");
    const [files, setFiles] = useState([
        {
            content: '',
            name: 'hello.cairo',
        }
    ]);
    const [logs, setLogs] = useState<{
        timestamp: number,
        message: string
    }[]>([]);
    const { account } = useAccount();
    const { compileCairo, compileContract, compileLoading, runCairo, runLoading, testLoading, runTests} = useCairoWasm();

    console.log(account, active, files, 'acc')

    const { contracts, setData: setContracts } = useContractStore();


    useEffect(() => {
        fetch('HelloStarknetAstro.cairo')
            .then(response => response.text())
            .then(data => {
                console.log(data);
                setFiles([{
                    content: data,
                    name: 'hello.cairo',
                }]);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleCompile = async () => {
        //get textarea cairo_program's value
        const cairo_program = files[active].content;
        console.log(cairo_program);
        if (!cairo_program) {
            return;
        }
        console.log(checkIsContract(cairo_program))
        if (checkIsContract(cairo_program)) {
            const res = await compileContract({starknetContract: cairo_program, replaceIds: isReplaceIds, allowWarnings: true});
            console.log(res, 'res');
            setCompileResult(res as string);
            setLogs([
                {
                    timestamp: Date.now(),
                    message: res as string,
                },
                ...logs,
            ]);
            const contractData = await genContractData(files[active].name, res as string);
            console.log(contractData, 'dd');

            setContracts({[files[active].name]: contractData})
        } else {
            const res = await compileCairo({cairoProgram: cairo_program, replaceIds: isReplaceIds});
            console.log(res, 'res');
            setCompileResult(res as string);
            setLogs([
                {
                    timestamp: Date.now(),
                    message: res as string,
                },
                ...logs,
            ])
        }
    }

    const handleRun = async () => {
        //get textarea cairo_program's value
        const cairo_program = files[active].content;
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
            {
                timestamp: Date.now(),
                message: res as string,
            },
            ...logs,
        ]);
    }

    const handleRunTest = async () => {
        const cairo_program = files[active].content;
        if (!cairo_program) {
            return;
        }
        const res = await runTests({
            cairoProgram: cairo_program,
        });
        console.log(res, 'res');
        setLogs([
            {
                timestamp: Date.now(),
                message: res as string,
            },
            ...logs,
        ]);
    }

    const addTab = () => {
        setFiles([
            ...files,
            {
                content: '',
                name: `new_${files.length}.cairo`,
            }
        ]);
        setActive(files.length);
    }

    const updateFileByIndex = (index: number, value: string) => {
        setFiles(files?.map((item, i) => {
            return {
                ...item,
                content: i === index ? value : item.content,
            };
        }))
    }

    const removeFile = (index: number) => {
        setFiles(files?.filter((item, i) => i !== index));
        if(index===active) {
            const newIndex = active === 0 ? 0 : active - 1;
            console.log('new', newIndex)
            setActive(newIndex);
        } else if(index < active) {
            setActive(active - 1);
        }
    }

    const handleOpenFile = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updateFileByIndex(active, e.target?.result as string);
            }
            reader.readAsText(file);
        }
    }

    const saveFile = async (fileName: string, content: string, isComplied?: boolean) => {
        if(!content) {
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
        <div className={'flex'}>
            <div className="h-full flex-1 border-l flex flex-col min-w-0">
                <div className="w-full">
                    <div className="flex items-center border-b">
                        {
                            files?.map((file, i) => {
                                return (
                                    <div key={i} onClick={() => {
                                        setActive(i);
                                    }}
                                         className={cn('flex items-center border-l border-r px-4 py-2 cursor-pointer gap-2', active === i ? 'border-t-2 border-t-primary' : '')}>
                                        {file.name}
                                        {i !== 0 && <X size={16} onClick={(e) => {
                                            removeFile(i);
                                            e.stopPropagation();
                                        }}/>}
                                    </div>
                                )
                            })
                        }
                        <div className="ml-auto mr-4">
                            <Button onClick={addTab} variant={'outline'} size={'icon'} className={'h-8 w-8'}>
                                <FilePlus size={16}/>
                            </Button>
                        </div>
                    </div>
                    <div>
                        {
                            files[active] ? <Editor
                                options={{
                                    fontSize: 14,
                                }}
                                theme={'vs-dark'}
                                height="40vh"
                                defaultLanguage="rust"
                                value={files[active].content}
                                onChange={(v) => updateFileByIndex(active, v || '')}
                            /> : null
                        }

                    </div>
                </div>
                <div className="toolbar flex justify-between gap-4 my-4 px-4">
                    <div className="flex gap-4">
                        <Button onClick={handleCompile} loading={compileLoading} className={'gap-1'}>
                            <Hammer size={16}/>
                            Compile
                        </Button>
                        <Button onClick={handleRun} loading={runLoading} className={'gap-1'}>
                            <Play size={16}/>
                            Run Cairo
                        </Button>
                        <Button onClick={handleRunTest} loading={testLoading} className={'gap-1'}>
                            <BugPlay size={16}/>
                            Run Test
                        </Button>
                        <Button onClick={() => {
                            setEnableDeploy(!enableDeploy);
                        }} className={'gap-1'}>
                            <Rocket size={16}/>
                            Deploy
                        </Button>
                    </div>
                    <div className="md:flex gap-4 hidden">
                        <Tooltip content={'Open file'}>
                            <div className={'relative'}>
                                <Button className="w-8 h-8" variant={'outline'} size={'icon'}>
                                    <FolderOpen size={16}/>
                                </Button>
                                <input type="file" onChange={handleOpenFile}
                                       className={'cursor-pointer absolute top-0 left-0 w-full h-full opacity-0'}/>
                            </div>
                        </Tooltip>
                        <Tooltip content={'Save source code'}>
                            <Button variant={'outline'} className="w-8 h-8" size={'icon'}
                                    onClick={() => saveFile('astro.cairo', files[active].content)}>
                                <FileDown size={16}/>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className="mt-4 flex-1">
                    <div className="flex justify-between items-center py-2 px-4 border-t">
                        <div className={'border-b border-primary text-sm'}>
                            output
                        </div>
                        <div className="flex gap-2">
                            <Tooltip content={'Save compile result'}>
                                <Button variant={'outline'} size={'icon'} className="w-8 h-8"
                                        onClick={() => saveFile('astro_compiled.sierra', compileResult, true)}>
                                    <Save size={16}/>
                                </Button>
                            </Tooltip>
                            <Tooltip content={'Clear'}>
                                <Button variant={'outline'} size={'icon'} className="w-8 h-8"
                                        onClick={() => setLogs([])}>
                                    <Eraser size={16}/>
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <div>
                        <ScrollArea className="h-[35vh]">
                            <div className="space-y-4 px-4">
                                {
                                    logs.map((log, index) => {
                                        return (
                                            <div key={index}>
                                                <div className="text-sm">[{displayTimeByTimeStamp(log.timestamp)}]
                                                </div>
                                                <Textarea defaultValue={log.message} readOnly className="text-sm border-none p-0 min-h-[200px]" >

                                                </Textarea>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
            {enableDeploy ? <DeployPanel/> : null}
        </div>
    )
}