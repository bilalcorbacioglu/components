/* eslint-disable max-lines */
import { Currency, CurrencyAmount, ElixirVaultProvider, Token } from '@pangolindex/sdk';
import React, { useCallback, useMemo } from 'react';
import { useChainId, usePangolinWeb3 } from 'src/hooks';
import { tryParseAmount } from '../pswap/hooks/common';
import { useCurrencyBalances } from '../pwallet/hooks/common';
import { ElixirVaultState, useElixirVaultStateAtom } from './atom';
import {
  depositElixirVaultLiquidity,
  getElixirVaultDetailFromProviders,
  getElixirVaultsFromProviders,
  removeElixirVaultLiquidity,
} from './providers';
import {
  DepositElixirVaultLiquidityProps,
  ElixirVault,
  ElixirVaultDetail,
  Field,
  GetElixirVaultDetailsProps,
  GetElixirVaultsProps,
  RemoveElixirVaultLiquidityProps,
  TransactionStatus,
} from './types';
// import { waitForTransaction } from 'src/utils';

export function useElixirVaultState(): ElixirVaultState {
  const { elixirVaultState } = useElixirVaultStateAtom();
  return elixirVaultState;
}

export function useElixirVaultActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Token) => void;
  onCloseDetailModal: () => void;
  onResetState: () => void;
  onSelectElixirVault: (elixirVault: ElixirVault) => void;
  onUserInput: (field: Field, typedValue: string) => void;
  onChangeElixirVaultLoaderStatus: () => void;
  onClearTransactionData: (transactionStatus: TransactionStatus) => void;
} {
  const {
    selectElixirVault,
    selectCurrency,
    clearTransactionData,
    setElixirVaults,
    changeElixirVaultLoaderStatus,
    resetSelectedVaultDetails,
    setTypeInput,
    resetState,
  } = useElixirVaultStateAtom();
  const { elixirVaults, elixirVaultsLoaderStatus } = useElixirVaultState();
  const chainId = useChainId();

  const onSelectElixirVault = (elixirVault: ElixirVault) => {
    const selectedElixirVaultIndex = elixirVaults.findIndex((r) => r === elixirVault);
    selectElixirVault({ selectedElixirVault: selectedElixirVaultIndex });
  };

  const onCloseDetailModal = useCallback(() => {
    resetSelectedVaultDetails();
  }, [resetSelectedVaultDetails]);

  const onCurrencySelection = useCallback(
    (field: Field, token: Token) => {
      selectCurrency({
        field,
        currencyId: token ? token.address : '',
      });
    },
    [selectCurrency, chainId],
  );

  const onResetState = useCallback(() => {
    resetState();
  }, [resetState]);

  const onClearTransactionData = useCallback(
    (transactionStatus?: TransactionStatus) => {
      clearTransactionData();
      if (transactionStatus === TransactionStatus.SUCCESS) {
        setElixirVaults({ elixirVaults: [], elixirVaultsLoaderStatus: false });
      }
    },
    [clearTransactionData, setElixirVaults],
  );

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      setTypeInput({ field, typedValue });
    },
    [setTypeInput],
  );

  const onChangeElixirVaultLoaderStatus = useCallback(() => {
    changeElixirVaultLoaderStatus({ elixirVaultsLoaderStatus: !elixirVaultsLoaderStatus });
  }, [changeElixirVaultLoaderStatus]);

  return {
    onCloseDetailModal,
    onCurrencySelection,
    onResetState,
    onSelectElixirVault,
    onUserInput,
    onChangeElixirVaultLoaderStatus,
    onClearTransactionData,
  };
}

export function useDerivedElixirVaultInfo(): {
  elixirVaults?: ElixirVault[];
  selectedVaultDetails?: ElixirVaultDetail;
  elixirVaultsLoaderStatus?: boolean;
  dependentField: Field;
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  depositTransactionLoaderStatus: boolean;
  depositTransactionStatus?: TransactionStatus;
  depositTransactionError?: Error;
} {
  const { account } = usePangolinWeb3();
  const chainId = useChainId();
  const {
    independentField,
    typedValue,
    elixirVaults,
    elixirVaultsLoaderStatus,
    selectedVaultDetails,
    depositTransactionLoaderStatus,
    depositTransactionStatus,
    depositTransactionError,
  } = useElixirVaultState();

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

  const tokenA = selectedVaultDetails?.poolTokens?.[0];
  const tokenB = selectedVaultDetails?.poolTokens?.[1];

  const [currencies] = useMemo(() => {
    const currencies: { [field in Field]?: Currency | undefined } = {
      [Field.CURRENCY_A]: (tokenA && tokenB && tokenA.equals(tokenB) ? tokenB : tokenA) ?? undefined,
      [Field.CURRENCY_B]: (tokenA && tokenB && tokenA.equals(tokenB) ? undefined : tokenB) ?? undefined,
    };

    return [currencies];
  }, [tokenA, tokenB]);

  // Balances
  const balances = useCurrencyBalances(
    chainId,
    account ?? undefined,
    useMemo(() => [currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]], [currencies]),
  );
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  };

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(
    typedValue,
    currencies[independentField],
    chainId,
  );

  const dependentAmount: CurrencyAmount | undefined = tryParseAmount('21', currencies[dependentField], chainId); //TODO: remove 21
  // TODO: Add logic for calculating dependent amount

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = useMemo(() => {
    return {
      [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
      [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount,
    };
  }, [dependentAmount, independentAmount, independentField]);

  return {
    elixirVaults,
    selectedVaultDetails,
    currencyBalances,
    dependentField,
    currencies,
    parsedAmounts,
    elixirVaultsLoaderStatus,
    depositTransactionLoaderStatus,
    depositTransactionStatus,
    depositTransactionError,
  };
}

export function useVaultActionHandlers(): {
  getVaults: (props: GetElixirVaultsProps) => void;
  getVaultDetails: (props: GetElixirVaultDetailsProps, vaultProvider: ElixirVaultProvider) => void;
  removeLiquidity: (props: RemoveElixirVaultLiquidityProps, vaultProvider: ElixirVaultProvider) => void;
  depositLiquidity: (props: DepositElixirVaultLiquidityProps, vaultProvider: ElixirVaultProvider) => void;
} {
  const {
    changeDepositTransactionLoaderStatus,
    changeRemoveTransactionLoaderStatus,
    setElixirVaults,
    setElixirVaultDetail,
  } = useElixirVaultStateAtom();
  const getVaults = async (routesProps: GetElixirVaultsProps) => {
    const promises = Object.values(getElixirVaultsFromProviders).map((getVaults) => getVaults(routesProps));
    const elixirVaults = (await Promise.allSettled(promises)).flatMap((p) => (p.status === 'fulfilled' ? p.value : []));
    setElixirVaults({
      elixirVaults: elixirVaults.filter((x: ElixirVault | undefined) => !!x) as ElixirVault[],
      elixirVaultsLoaderStatus: false,
    });
  };

  const getVaultDetails = async (props: GetElixirVaultDetailsProps, vaultProvider: ElixirVaultProvider) => {
    const promise = getElixirVaultDetailFromProviders[vaultProvider.id](props);
    const res = await Promise.allSettled([promise]);
    const elixirVaultDetails = (
      res?.flatMap((p) => (p.status === 'fulfilled' ? p.value : [])) as ElixirVaultDetail[]
    )?.[0];
    setElixirVaultDetail({
      selectedVaultDetails: elixirVaultDetails,
    });
    return res;
  };

  const removeLiquidity = async (props: RemoveElixirVaultLiquidityProps, vaultProvider: ElixirVaultProvider) => {
    changeRemoveTransactionLoaderStatus({ removeTransactionLoaderStatus: true, removeTransactionStatus: undefined });
    const promise = removeElixirVaultLiquidity[vaultProvider.id](props);
    await Promise.allSettled([promise]);
    changeRemoveTransactionLoaderStatus({
      removeTransactionLoaderStatus: false,
      removeTransactionStatus: TransactionStatus.SUCCESS,
    });
  };

  const depositLiquidity = async (props: DepositElixirVaultLiquidityProps, vaultProvider: ElixirVaultProvider) => {
    changeDepositTransactionLoaderStatus({ depositTransactionLoaderStatus: true, depositTransactionStatus: undefined });
    const promise = depositElixirVaultLiquidity[vaultProvider.id](props);
    await Promise.allSettled([promise]);

    changeDepositTransactionLoaderStatus({
      depositTransactionLoaderStatus: false,
      depositTransactionStatus: TransactionStatus.SUCCESS,
    });
  };

  return {
    getVaults,
    getVaultDetails,
    removeLiquidity,
    depositLiquidity,
  };
}
