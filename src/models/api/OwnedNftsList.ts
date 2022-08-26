import { GenericState } from "../common/GenericState";

export interface Contract {
  address: string;
}

export interface TokenMetadata {
  tokenType: string;
}

export interface Id {
  tokenId: string;
  tokenMetadata: TokenMetadata;
}

export interface TokenUri {
  raw: string;
  gateway: string;
}

export interface Medium {
  raw: string;
  gateway: string;
  thumbnail: string;
}

export interface Attribute {
  display_type: string;
  value: any;
  trait_type: string;
}

export interface Metadata {
  background_image: string;
  image: string;
  is_normalized: boolean;
  segment_length: number;
  image_url: string;
  name: string;
  description: string;
  attributes: Attribute[];
  name_length: number;
  version: number;
  url: string;
  externalUrl: string;
}

export interface ContractMetadata {
  name: string;
  symbol: string;
  totalSupply: string;
  tokenType: string;
}

export interface OwnedNft {
  contract: Contract;
  id: Id;
  balance: string;
  title: string;
  description: string;
  tokenUri: TokenUri;
  media: Medium[];
  metadata: Metadata;
  timeLastUpdated: Date;
  contractMetadata: ContractMetadata;
}

export interface OwnedNftsList {
  ownedNfts: OwnedNft[];
  totalCount: number;
  blockHash: number;
}

export interface OwnedNftsListState
  extends GenericState<OwnedNftsList | null> {}
