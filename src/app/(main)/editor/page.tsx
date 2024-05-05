'use client';
import {Tabs} from "@/components/Tabs";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {PlusCircleIcon} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {checkIsContract} from "@/utils/common";
import {useSettingStore} from "@/stores/setting";
import {useAccount} from "@starknet-react/core";

enum TabEnum {
    COMPILETAB = 'COMPILETAB',
    RUNTAB = "RUNTAB",
    TESTTAB = "TESTTAB"
}

export default function Editor() {
    const [textValues, setTextValues] = useState<string[]>([]);
    const [active, setActive] = useState(0);
    const { isReplaceIds,  availableGas, printFullMemory, useCairoDebugPrint } = useSettingStore();
    const [compileResult, setCompileResult] = useState<string>("");
    const [runResult, setRunResult] = useState<string>("");
    const [testResult, setTestResult] = useState<string>("");
    const [tabs, setTabs] = useState([
        {
            value: 0,
            label: 'Default',
        }
    ]);
    const [compileLoading, setCompileLoading] = useState(false);
    const [runLoading, setRunLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(TabEnum.COMPILETAB);
    const { account } = useAccount();

    console.log(account, 'acc')

    const workerRef = useRef<Worker>();

    useEffect(() => {
        workerRef.current = new Worker(new URL('../../../../worker.js', import.meta.url));
        // workerRef.current.onmessage = (event: MessageEvent<number>) =>
        //     alert(`WebWorker Response => ${event.data}`);
        return () => {
            workerRef.current?.terminate();
        };
    }, []);


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

    const handleCompile = () => {
        //get textarea cairo_program's value
        const cairo_program = textValues[active];
        console.log(textValues, active, cairo_program);
        if (cairo_program == "" || cairo_program == null || cairo_program == undefined) {
            return;
        }
        setCompileLoading(true);
        if (checkIsContract(cairo_program)) {
            workerRef.current?.postMessage({
                data: cairo_program,
                replaceIds: isReplaceIds,
                functionToRun: "compileStarknetContract"
            });
        } else {
            workerRef.current?.postMessage({
                data: cairo_program,
                replaceIds: isReplaceIds,
                functionToRun: "compileCairoProgram"
            });
        }

        workerRef.current!.onmessage = function (e) {
            console.log(e, 'msg');
            setCompileResult(e.data);
            setCompileLoading(false);
            setActiveTab(TabEnum.COMPILETAB);
        };
    }

    const handleRun = () => {
        //get textarea cairo_program's value
        const cairo_program = textValues[active];
        if (cairo_program == "" || cairo_program == null || cairo_program == undefined) {
            return;
        }
        setRunLoading(true);
        const gasValue = availableGas;
        workerRef.current?.postMessage({
            data: cairo_program,
            availableGas: gasValue == "" ? undefined : parseInt(gasValue),
            printFullMemory: printFullMemory,
            useDBGPrintHint: useCairoDebugPrint,
            functionToRun: "runCairoProgram"
        });
        workerRef.current!.onmessage = function(e) {
            setRunResult(e.data);
            setRunLoading(false);
            setActiveTab(TabEnum.RUNTAB);
        };
    }

    const handleRunTest = () => {
        const cairo_program = textValues[active];
        if (cairo_program == "" || cairo_program == null || cairo_program == undefined) {
            return;
        }
        setTestLoading(true);
        workerRef.current?.postMessage({
            data: cairo_program,
            functionToRun: "runTest"
        });
        workerRef.current!.onmessage = function(e) {
            setTestResult(e.data);
            setTestLoading(false);
            setActiveTab(TabEnum.TESTTAB);
        };
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
            {/*<div className="tab-bar">*/}
            {/*    <button className="tab-item active">Default</button>*/}
            {/*    <button id="new-tab">+</button>*/}
            {/*</div>*/}
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
            <div className="pt-2 flex-1">
                <Tabs value={activeTab} onValueChange={v => setActiveTab(v as TabEnum)} items={[
                    {
                        value: TabEnum.COMPILETAB,
                        label: 'Compile Result',
                        content: <div id="CompileResult" className="tabcontent">
                            <Textarea value={compileResult} readOnly id="sierra_program"
                                      className="h-[20vh]"></Textarea>
                        </div>
                    },
                    {
                        value: TabEnum.RUNTAB,
                        label: 'Output',
                        content: <div id="RunResult" className="tabcontent">
                            <Textarea readOnly id="run_result" className="h-[20vh]" value={runResult}>No
                                output.</Textarea>
                        </div>
                    },
                    {
                        value: TabEnum.TESTTAB,
                        label: 'Test Result',
                        content: <div className="tabcontent">
                            <Textarea readOnly className="h-[20vh]" value={testResult}>No output.</Textarea>
                        </div>
                    }
                ]}
                      extra={<Button variant={'outline'} className="ml-auto mr-2"
                                     onClick={() => saveFile('astro_compiled.sierra', compileResult, true)}>Save
                          compiled
                          file
                      </Button>}
                />
            </div>
        </div>
    )
}