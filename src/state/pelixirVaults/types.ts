import { Chain, ElixirVaultProvider, Token } from '@pangolindex/sdk';
import { BigNumber } from 'ethers';

export type ElixirVault = {
  selected: boolean;
  address: string;
  poolTokens: Token[];
  strategyProvider: ElixirVaultProvider[];
  sharePrice: string;
  incentivized: boolean;
  feesApr: string;
  incentivizationApr: string;
};

export type ElixirVaultDetail = ElixirVault & {
  underlyingToken0?: string;
  underlyingToken1?: string;
  underlyingToken0Price?: string;
  underlyingToken1Price?: string;
  strategyDetailWebsite: string;
  userLiquidity?: string;
  ratio?: number;
};

export type GetElixirVaultsProps = {
  chain: Chain;
};

export type GetElixirVaultDetailsProps = {
  chain: Chain;
  vault: ElixirVault;
  account?: string;
  library?: any;
};

export type RemoveElixirVaultLiquidityProps = {
  vault: ElixirVault;
  account: string;
  shares: string | number | BigNumber;
  library?: any;
  changeRemoveTransactionLoaderStatus?: ({ removeTransactionLoaderStatus, removeTransactionStatus }: any) => void;
  setRemoveTransactionError?: ({ removeTransactionError }: any) => void;
};

export type DepositElixirVaultLiquidityProps = {
  amount0: string | number | BigNumber;
  amount1: string | number | BigNumber;
  selectedElixirVault: ElixirVault;
  account: string;
  library?: any;
  changeDepositTransactionLoaderStatus?: ({ depositTransactionLoaderStatus, depositTransactionStatus }: any) => void;
  setDepositTransactionError?: ({ depositTransactionError }: any) => void;
};

export type GetElixirVaults = (props: GetElixirVaultsProps) => Promise<ElixirVault[]>;
export type GetElixirVaultDetails = (props: GetElixirVaultDetailsProps) => Promise<ElixirVaultDetail>;
export type RemoveElixirVaultLiquidity = (props: RemoveElixirVaultLiquidityProps) => Promise<void>;
export type DepositElixirVaultLiquidity = (props: DepositElixirVaultLiquidityProps) => Promise<void>;

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export type DefiEdgeAllStrategyData = {
  address: string;
  apr24Hour?: number;
  apr7Day?: number;
  aum: number;
  dataFeed: string;
  dex: string;
  fees: number;
  network: string;
  owner: string;
  token0: {
    id: string;
    decimals: number;
    name: string;
    symbol: string;
    totalSupply: number;
  };
  token1: {
    id: string;
    decimals: number;
    name: string;
    symbol: string;
    totalSupply: number;
  };
  poolAddress: string;
  sharePrice: number;
  subTitle: string;
  title: string;
  updatedAt: string;
  inceptionDate: string;
};

export type DefiEdgeStrategyData = {
  strategy: {
    address: string;
    apr24Hour: number;
    apr7Day: number;
    createdAt: string;
    dataFeed: string;
    dex: string;
    fees_apr_usd: number;
    network: string;
    poolAddress: string;
    title: string;
    token0Symbol: string;
    token1Symbol: string;
    transactionHash: string;
    updatedAt: string;
    fees_apr: number;
    token0: {
      id: string;
      decimals: number;
      name: string;
      symbol: string;
      totalSupply: number;
    };
    token1: {
      id: string;
      decimals: number;
      name: string;
      symbol: string;
      totalSupply: number;
    };
  };
  feeOtz?: number;
  feeZto?: number;
  token0Price?: string;
  token1Price?: string;
  sharePrice?: number;
  aum?: number;
  totalSupply?: number;
  totalSupplyBN?: {
    type: string;
    hex: string;
  };
};

export type DefiEdgeStrategyLiquidityData = {
  amount0: string;
  amount1: string;
  unusedAmount0: string;
  unusedAmount1: string;
  amount0Total: string;
  amount1Total: string;
  unusedAmount0BigNumber?: {
    type: string;
    hex: string;
  };
  unusedAmount1BigNumber?: {
    type: string;
    hex: string;
  };
};
