export default function AboutPanel() {
    return (
        <div className="px-4 pt-6 lg:px-8 w-full">
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