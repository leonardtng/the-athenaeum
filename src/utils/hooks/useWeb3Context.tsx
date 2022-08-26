import {
  ExternalProvider,
  JsonRpcProvider,
  StaticJsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactElement,
  useCallback,
  useEffect,
} from "react";
import Web3Modal, { CONNECT_EVENT } from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider";
import { ETHEREUM } from "../web3/Chains";
import { NodeStatus } from "../web3/NodeStatus";
import { formatEther } from "@ethersproject/units";

function isIframe() {
  return window.location !== window.parent.location;
}

type onChainProvider = {
  connect: () => Promise<JsonRpcProvider | undefined>;
  disconnect: () => void;
  checkWrongNetwork: () => Promise<boolean>;
  hasCachedProvider: () => boolean;
  provider: JsonRpcProvider;
  address: string;
  connected: boolean;
  web3Modal: Web3Modal;
  chainID: number;
  vchainID: number;
  balance: string;
  scanner?: string;
};

type Address = string;

export type Web3ContextData = {
  onChainProvider: onChainProvider;
} | null;

const Web3Context = createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
  const web3Context = useContext(Web3Context);
  if (!web3Context) {
    throw new Error(
      "useWeb3Context() can only be used inside of <Web3ContextProvider />, please declare it at a higher level."
    );
  }

  const { onChainProvider } = web3Context;

  return useMemo(() => {
    return { ...onChainProvider };
  }, [onChainProvider]);
};

export const useAddress = () => {
  const { address } = useWeb3Context();
  return address;
};

export const WEB_3_MODAL = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: ETHEREUM.rpc[0],
        qrcode: true,
        qrcodeModalOptions: {
          mobileLinks: ["metamask", "trust"],
        },
      },
    },
  },
});

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [chainID, setChainID] = useState<number>(1);
  const [vchainID, setVChain] = useState<number>(1);
  const [address, setAddress] = useState<Address>("");
  const [balance, setBalance] = useState<string>("");

  const [uri, setUri] = useState(ETHEREUM.rpc[0]);

  const [provider, setProvider] = useState<JsonRpcProvider>(
    new StaticJsonRpcProvider(uri)
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hasCachedProvider = (): boolean => {
    if (!WEB_3_MODAL) return false;
    if (!WEB_3_MODAL.cachedProvider) return false;
    return true;
  };

  const _initListeners = useCallback(
    (rawProvider: any) => {
      if (!rawProvider.on) {
        return;
      }
      rawProvider.on("accountsChanged", async (accounts: string[]) => {
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("chainChanged", async (chain: number) => {
        setVChain(chain);
        setTimeout(() => window.location.reload(), 1);
      });

      rawProvider.on("network", (_newNetwork: any, oldNetwork: any) => {
        if (!oldNetwork) return;
        window.location.reload();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider]
  );

  const _checkNetwork = (otherChainID: number): boolean => {
    if (chainID === otherChainID) {
      return true;
    }

    const chain = ETHEREUM.chainId === otherChainID;
    if (!chain) {
      return false;
    }
    setChainID(ETHEREUM.chainId);
    setUri(ETHEREUM.rpc[0]);
    return true;
  };

  const _connect = useCallback(async (provider: ExternalProvider) => {
    _initListeners(provider);
    const connectedProvider = new Web3Provider(provider, "any");

    const chainId = await connectedProvider
      .getNetwork()
      .then((network) => network.chainId);

    setVChain(chainId);

    const connectedAddress = await connectedProvider.getSigner().getAddress();

    _checkNetwork(chainId);

    if (chainId !== ETHEREUM.chainId) {
      return;
    }

    setAddress(connectedAddress);
    setProvider(connectedProvider);
    setConnected(true);
    return connectedProvider;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(async () => {
    if (connected && provider) {
      return provider;
    }

    let rawProvider;

    if (isIframe()) {
      rawProvider = new IFrameEthereumProvider();
    } else {
      rawProvider = await WEB_3_MODAL.connect();
    }

    return await _connect(rawProvider);
  }, [_connect, connected, provider]);

  useEffect(() => {
    if (connected) {
      return;
    }

    const onConnect = (provider: ExternalProvider) => {
      _connect(provider);
    };

    WEB_3_MODAL.on(CONNECT_EVENT, onConnect);

    return () => {
      WEB_3_MODAL.off(CONNECT_EVENT, onConnect);
    };
  }, [_connect, connected]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkWrongNetwork = async (): Promise<boolean> => {
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);
    setVChain(chainId);
    if (chainId === 1) {
      return false;
    }
    return true;
  };

  const disconnect = useCallback(async () => {
    WEB_3_MODAL.clearCachedProvider();
    setConnected(false);

    setTimeout(() => {
      window.location.reload();
    }, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, connected]);

  provider
    .getBalance(address)
    .then((balance) => {
      const balanceInEth = formatEther(balance);
      setBalance(balanceInEth);
    })
    .catch((err) => err);

  const onChainProvider = useMemo(
    () => ({
      connect,
      disconnect,
      checkWrongNetwork,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainID,
      vchainID,
      web3Modal: WEB_3_MODAL,
      uri,
      balance,
    }),
    [
      connect,
      disconnect,
      checkWrongNetwork,
      hasCachedProvider,
      provider,
      connected,
      address,
      chainID,
      vchainID,
      uri,
      balance,
    ]
  );

  useEffect(() => {
    NodeStatus(ETHEREUM.rpc[0]);
  }, []);

  return (
    <Web3Context.Provider value={{ onChainProvider }}>
      {children}
    </Web3Context.Provider>
  );
};
