import React, { useState, ReactElement, useCallback, useEffect } from "react";
import { CONNECT_EVENT } from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider";
import { WEB_3_MODAL } from "./useWeb3Context";
import { ETHEREUM, Chain } from "../web3/Chains";

export enum Web3Connection {
  Disconnected,
  ConnectedWrongChain,
  Connected,
}

// type Web3ChainStatus =
//   | {
//       connection: Web3Connection.Connected;
//       chain: Chain;
//       address: string;
//       provider: Web3Provider;
//     }
//   | {
//       connection: Web3Connection.ConnectedWrongChain;
//       switchChain: () => Promise<void>;
//       chain: Chain;
//     }
//   | {
//       connection: Web3Connection.Disconnected;
//       connect: () => Promise<void>;
//     };

interface ContextProps {
  connected?: Chain;
  address?: string;
  connect: () => Promise<void>;
  provider?: Web3Provider;
}
const Web3Chain = React.createContext<ContextProps | undefined>(undefined);

export const Web3ChainProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [chain, setChain] = useState<Chain>();
  const [address, setAddress] = useState<string>();
  const [provider, setProvider] = useState<Web3Provider>();

  const onConnect = useCallback(async (externalProvider: any) => {
    externalProvider.on("accountsChanged", async (accounts: string[]) => {
      window.location.reload();
    });

    externalProvider.on("chainChanged", async (chain: number) => {
      window.location.reload();
    });

    externalProvider.on("network", (_newNetwork: any, oldNetwork: any) => {
      window.location.reload();
    });
    const connectedProvider = new Web3Provider(externalProvider, "any");
    setProvider(connectedProvider);
  }, []);

  const connect = useCallback(async () => {
    let externalProvider;
    if (window.location !== window.parent.location) {
      // Ledger Live
      externalProvider = new IFrameEthereumProvider();
    } else {
      try {
        externalProvider = await WEB_3_MODAL.connect();
      } catch (e) {
        console.error("wallet isn't logged in");
      }
    }

    if (!externalProvider) {
      return;
    }
    onConnect(externalProvider);
  }, [onConnect]);

  useEffect(() => {
    if (chain !== undefined) {
      return;
    }
    WEB_3_MODAL.on(CONNECT_EVENT, onConnect);
    return () => {
      WEB_3_MODAL.off(CONNECT_EVENT, onConnect);
    };
  }, [onConnect, chain]);

  useEffect(() => {
    // Always run connect() on application start.
    if (WEB_3_MODAL.cachedProvider) {
      connect();
    }
  }, [connect]);

  useEffect(() => {
    if (provider === undefined) {
      setChain(undefined);
      setAddress(undefined);
      return;
    }

    let isCanceled = false;
    (async function () {
      const chainId = await provider
        .getNetwork()
        .then((network) => network.chainId);

      if (chainId !== ETHEREUM.chainId) {
        return false;
      }
      const chain = ETHEREUM;
      const address = await provider.getSigner().getAddress();

      if (isCanceled) {
        return;
      }

      setChain(chain);
      setAddress(address);
    })();

    return () => {
      isCanceled = true;
    };
  }, [provider]);

  return (
    <Web3Chain.Provider
      value={{ connected: chain, connect, address, provider }}
    >
      {children}
    </Web3Chain.Provider>
  );
};
// function switchNetwork(want: Chain): any {
//   throw new Error("Function not implemented.");
// }
