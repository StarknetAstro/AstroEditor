import { useEffect, useContext, useRef } from 'react'

enum LogType {
    Error,
    Warn,
    Info,
}

const Console = ({logs}:{logs: any[]}) => {
    const container = useRef<HTMLDivElement>(null)
    const endDiv = useRef<HTMLDivElement>(null)

    useEffect(() => {
        container.current?.parentElement?.scrollTo({
            top: endDiv.current?.offsetTop,
            behavior: 'smooth',
        })
    }, [logs])

    return (
        <div ref={container} className="p-4">
            <p className="text-gray-500 dark:text-[#BDBDBD] font-medium uppercase text-[13px] leading-6">
                Console
            </p>
            <div className="leading-6 text-tiny text-gray-400 dark:text-darkMode-text">
                {logs.map((log, index) => (
                    <pre key={index}>
            {log.type === LogType.Error && (
                <span className="text-red-500">[Error] </span>
            )}
                        {log.type === LogType.Warn && (
                            <span className="text-yellow-500">[Warn] </span>
                        )}
                        {log.message}
          </pre>
                ))}
                <div ref={endDiv}></div>
            </div>
        </div>
    )
}