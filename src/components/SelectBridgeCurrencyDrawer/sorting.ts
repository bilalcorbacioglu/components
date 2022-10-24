import { BridgeCurrency, TokenAmount } from '@pangolindex/sdk';
import { useMemo } from 'react';
import { useAllTokenBalances } from 'src/state/pwallet/hooks';

// compare two token amounts with highest one coming first
function balanceComparator(balanceA?: TokenAmount, balanceB?: TokenAmount) {
  if (balanceA && balanceB) {
    return balanceA.greaterThan(balanceB) ? -1 : balanceA.equalTo(balanceB) ? 0 : 1;
  } else if (balanceA && balanceA.greaterThan('0')) {
    return -1;
  } else if (balanceB && balanceB.greaterThan('0')) {
    return 1;
  }
  return 0;
}

function getTokenComparator(balances: {
  [tokenAddress: string]: TokenAmount | undefined;
}): (tokenA: BridgeCurrency, tokenB: BridgeCurrency) => number {
  return function sortTokens(tokenA: BridgeCurrency, tokenB: BridgeCurrency): number {
    // -1 = a is first
    // 1 = b is first

    // sort by balances
    const balanceA = balances[tokenA.address];
    const balanceB = balances[tokenB.address];

    const balanceComp = balanceComparator(balanceA, balanceB);
    if (balanceComp !== 0) return balanceComp;

    if (tokenA.symbol && tokenB.symbol) {
      // sort by symbol
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1;
    } else {
      return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0;
    }
  };
}

export function useTokenComparator(inverted: boolean): (tokenA: BridgeCurrency, tokenB: BridgeCurrency) => number {
  const balances = useAllTokenBalances();
  const comparator = useMemo(() => getTokenComparator(balances ?? {}), [balances]);
  return useMemo(() => {
    if (inverted) {
      return (tokenA: BridgeCurrency, tokenB: BridgeCurrency) => comparator(tokenA, tokenB) * -1;
    } else {
      return comparator;
    }
  }, [inverted, comparator]);
}
