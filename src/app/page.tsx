'use client';

import logo from '@/assets/logo.png';
import {Button} from "@/components/ui/button";
import {Codesandbox, Cog, Info, PlusCircleIcon} from "lucide-react";
import {Tabs} from "@/components/Tabs";
import {Textarea} from "@/components/ui/textarea";
import {useEffect, useRef, useState} from "react";
import {checkIsContract} from "@/utils/common";
import {Input} from "@/components/ui/input";
import {SectionCard} from "@/components/SectionCard";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Select} from "@/components/Select";
import {ModeToggle} from "@/components/mode-toggle";

enum PageEnum {
  EDITOR = "editor",
  SETTING = "setting",
  ABOUT = "about"
}

enum TabEnum {
  COMPILETAB = 'COMPILETAB',
  RUNTAB = "RUNTAB",
  TESTTAB = "TESTTAB"
}

const pages = [
  {
    value: PageEnum.EDITOR,
    label: 'Editor',
    icon: <Codesandbox className="mr-2 h-4 w-4"/>
  },
  {
    value: PageEnum.SETTING,
    label: 'Setting',
    icon: <Cog className="mr-2 h-4 w-4"/>
  },
  {
    value: PageEnum.ABOUT,
    label: 'About',
    icon: <Info className="mr-2 h-4 w-4"/>
  }
]


const Sidebar = ({ page, setPage }: {page: PageEnum; setPage: (v: PageEnum) => void}) => {
  return (
      <div className={"pb-12 hidden md:block"}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {
                pages.map((item, index) => {
                  return (
                      <Button key={index} variant={item.value === page ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setPage(item.value)}>
                        {item.icon}
                        {item.label}
                      </Button>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
  )
}


export default function Home() {
  const [page, setPage] = useState(PageEnum.EDITOR);
  const [textValues, setTextValues] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [isReplaceIds, setIsReplaceIds] = useState(false);
  const [compileResult, setCompileResult] = useState<string>("");
  const [runResult, setRunResult] = useState<string>("");
  const [testResult, setTestResult] = useState<string>("");
  const [availableGas, setAvailableGas] = useState("");
  const [printFullMemory, setPrintFullMemory] = useState(false);
  const [useCairoDebugPrint, setUseCairoDebugPrint] = useState(false);
  const [tabs, setTabs] = useState([
    {
      value: 0,
      label: 'Default',
    }
  ]);
  const [cairoVersion, setCairoVersion] = useState('2.0');
  const [compileLoading, setCompileLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(TabEnum.COMPILETAB)

  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../worker.js', import.meta.url));
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
      <div className={'p-0 h-[100vh] flex flex-col'}>
        <div className="flex w-full items-center justify-between px-4 py-4 border-b">
          <div className="flex gap-2 items-center">
            <a href="https://github.com/StarknetAstro/AstroEditor" target={'_blank'}>
              <img src={logo.src} className={'w-10 rounded-lg'} alt=""/>
            </a>
            <div className="text-primary font-bold text-lg">Astro Editor</div>
          </div>
          <ModeToggle/>
        </div>
        <div className="editor grid lg:grid-cols-5 flex-1">
          <Sidebar page={page} setPage={setPage} />
          <div className="main col-span-3 lg:col-span-4 lg:border-l px-4 pt-6 lg:px-8">
            {page === PageEnum.EDITOR && (
                <div id="Code" className="h-full flex flex-col">
                  <div className="">
                    <Tabs value={String(active)} onValueChange={(v) => setActive(Number(v))} items={tabs.map((tab, index) => {
                      return {
                        value: String(tab.value),
                        label: tab.label,
                        content: <div className="tabs-content">
                          {/*Tab content will be added here dynamically*/}
                          <Textarea id="cairo_program" value={textValues[index]} onChange={e => setTextValueByIndex(index, e.target.value)}
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
                      <Button onClick={handleRunTest} loading={runLoading}>Run Test</Button>
                    </div>
                    <div className="md:flex gap-4 hidden">
                      <div className={'relative'}>
                        <Button id="open-file-button" variant={'outline'}>Open File</Button>
                        <input type="file" onChange={handleOpenFile} className={'cursor-pointer absolute top-0 left-0 w-full h-full opacity-0'}/>
                      </div>
                      <Button variant={'outline'} className="file-button" onClick={() => saveFile('astro.cairo', textValues[active])}>Save source code</Button>
                    </div>
                  </div>
                  <div className="pt-2 flex-1">
                    <Tabs value={activeTab} onValueChange={v => setActiveTab(v as TabEnum)} items={[
                      {
                        value: TabEnum.COMPILETAB,
                        label: 'Compile Result',
                        content: <div id="CompileResult" className="tabcontent">
                          <Textarea value={compileResult} readOnly id="sierra_program" className="h-[20vh]"></Textarea>
                        </div>
                      },
                      {
                        value: TabEnum.RUNTAB,
                        label: 'Output',
                        content: <div id="RunResult" className="tabcontent">
                          <Textarea readOnly id="run_result" className="h-[20vh]" value={runResult}>No output.</Textarea>
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
                          extra={<Button variant={'outline'} className="ml-auto mr-2" onClick={() => saveFile('astro_compiled.sierra', compileResult, true)}>Save compiled
                            file
                          </Button>}
                    />
                  </div>
                </div>
            )}
            {
                page === PageEnum.SETTING && (
                    <div id="Settings" className="page-content space-y-4">
                      <SectionCard title="Cairo Compiler settings" className={'space-y-4'}>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="terms" checked={isReplaceIds} onCheckedChange={(v: boolean) => setIsReplaceIds(v)}  />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Replace ids
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cairo version:</Label>
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
                            <Checkbox id="terms" checked={printFullMemory} onCheckedChange={(v: boolean) => setPrintFullMemory(v)} />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Print full memory
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="terms" checked={useCairoDebugPrint} onCheckedChange={(v: boolean) => setUseCairoDebugPrint(v)} />
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
                            <Input type="number" id="available-gas" className={'w-20'} value={availableGas} onChange={e => setAvailableGas(e.target.value)}/>
                          </div>
                        </div>
                      </SectionCard>
                    </div>
                )
            }
            {
                page === PageEnum.ABOUT && (
                    <div id="About" className="page-content">
                      <h2 className={'text-xl font-bold'}>About Astro Editor</h2>
                      <p>A cutting-edge, online Integrated Development Environment (IDE) built on top of WASM-Cairo.
                        All-JavaScript-or-WASM environment, free of dependencies on backend servers and local
                        setups. </p>
                      <h2 className={'text-xl font-bold mt-4'}>About WASM-Cairo Project</h2>
                      <p>A suite of development tools and an environment for Cairo 1, all based on WebAssembly.</p>
                      <h2 className={'text-xl font-bold mt-4'}>About Me</h2>
                      <p>I&apos;m <a href="https://twitter.com/cryptonerdcn">cryptonedcn</a>, from <a
                          href="https://twitter.com/starknetastrocn">Starknet Astro</a>.</p>
                      <h2 className={'text-xl font-bold mt-4'}>About Starknet Astro</h2>
                      <p>Starknet Astro, established in January 2023, is the most creative and hardcore
                        media/community on Starknet Ecosystem, providing insightful researches and education
                        activities of Starknet and Cairo Language.</p>
                    </div>
                )
            }
          </div>
        </div>
      </div>
  )
}