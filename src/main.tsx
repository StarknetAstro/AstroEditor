import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ThemeProvider, useTheme} from "@/components/theme-provider.tsx";
import {
    darkTheme,
    getDefaultWallets, lightTheme,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Analytics } from '@vercel/analytics/react';
import {createHashRouter, RouterProvider} from "react-router-dom";
import {ENVS} from "@/constants";

const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, zora],
    [
        alchemyProvider({ apiKey: ENVS.VITE_ALCHEMY_ID }),
        publicProvider()
    ]
);

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: ENVS.VITE_WALLET_CONNECT_ID,
    chains
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
})

const router = createHashRouter([
    {
        path: "/",
        element: <App/>,
    },
]);

const RainbowApp = () => {
    const {theme} = useTheme();
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} theme={theme === 'dark' ? darkTheme() : lightTheme()}>
                <RouterProvider router={router}/>
            </RainbowKitProvider>
        </WagmiConfig>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <RainbowApp/>
          <Analytics/>
      </ThemeProvider>
  </React.StrictMode>,
)
