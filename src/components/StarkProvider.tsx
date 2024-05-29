import { goerli, mainnet } from '@starknet-react/chains';
import {
    argent,
    braavos,
    publicProvider,
    StarknetConfig,
    starkscan,
    useInjectedConnectors,
    Connector, useAccount, useConnect, useDisconnect, useProvider
} from '@starknet-react/core';

export function StarknetProvider({ children }: { children: React.ReactNode }) {
    const { connectors } = useInjectedConnectors({
        // Show these connectors if the user has no connector installed.
        recommended: [argent(), braavos()],
        // Hide recommended connectors if the user has any connector installed.
        includeRecommended: 'onlyIfNoConnectors',
        // Randomize the order of the connectors.
        order: 'alphabetical'
    });

    return (
        <StarknetConfig
            autoConnect
            chains={[mainnet, goerli]}
            provider={publicProvider()}
            connectors={connectors}
            explorer={starkscan}
        >
            {children}
        </StarknetConfig>
    );
}