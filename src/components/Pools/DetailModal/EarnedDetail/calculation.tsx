import { TokenAmount } from '@pangolindex/sdk';
import React from 'react';
import { useMinichefPendingRewards } from 'src/state/pstake/hooks';
import { StakingInfo } from 'src/state/pstake/types';

export interface CalculationProps {
  setTotalUSD: React.Dispatch<React.SetStateAction<number>>;
  useUSDCPrice: any;
  totalUSD: number;
  reward: TokenAmount;
  stakingInfo: StakingInfo;
  index: number;
}

const EarnedCalculation = ({ setTotalUSD, useUSDCPrice, totalUSD, reward, stakingInfo, index }: CalculationProps) => {
  const { rewardTokensMultiplier } = useMinichefPendingRewards(stakingInfo);
  const tokenMultiplier = rewardTokensMultiplier?.[index];
  const extraTokenWeeklyRewardRate = stakingInfo?.getExtraTokensWeeklyRewardRate?.(
    stakingInfo?.rewardRatePerWeek,
    reward?.token,
    tokenMultiplier,
  ) as TokenAmount;
  const currencyUSDPrice = useUSDCPrice(reward?.token);
  setTotalUSD(Number(currencyUSDPrice?.toFixed()) * Number(extraTokenWeeklyRewardRate?.toSignificant(4)) + totalUSD);

  return <></>;
};

export default EarnedCalculation;
