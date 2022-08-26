import ethereumChain from "../../assets/chains/ethereum.json";
import ethereumLogo from "../../assets/chains/ethereum.svg";

export interface Chain {
    name: string;
    longName: string;
    chainId: number;
    color: string;
    logo: string;
    isFavorite?: boolean;
    tokens: Token[];
    rpc: string[];
    explorers: string[];
  }
  
  export interface Token {
    id: string;
    name: string;
    address: string;
    symbol: string;
    logo: string;
    favorite?: boolean;
    isNative?: boolean;
    decimals?: number;
  }

export const ETHEREUM: Chain = { ...ethereumChain, logo: ethereumLogo };