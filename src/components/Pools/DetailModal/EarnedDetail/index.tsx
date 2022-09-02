import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stat, Text } from 'src/components';
import { BIG_INT_ZERO } from 'src/constants';
import { USDC } from 'src/constants/tokens';
import { useChainId } from 'src/hooks';
import { useUSDCPricekHook } from 'src/hooks/multiChainsHooks';
import { useGetEarnedAmount, useMinichefPendingRewards } from 'src/state/pstake/hooks';
import { StakingInfo } from 'src/state/pstake/types';
import ClaimDrawer from '../../ClaimDrawer';
import RemoveDrawer from '../../RemoveDrawer';
import EarnedCalculation from './calculation';
import { InnerWrapper, Wrapper } from './styleds';

export interface EarnDetailProps {
  stakingInfo: StakingInfo;
  version: number;
}

const EarnedDetail = ({ stakingInfo, version }: EarnDetailProps) => {
  const { t } = useTranslation();
  const chainId = useChainId();

  const [isClaimDrawerVisible, setShowClaimDrawer] = useState(false);
  const [isRemoveDrawerVisible, setShowRemoveDrawer] = useState(false);
  const [totalUSD, setTotalUSD] = useState(0);
  const usdc = USDC[chainId];

  const { rewardTokensAmount } = useMinichefPendingRewards(stakingInfo);

  const isSuperFarm = (rewardTokensAmount || [])?.length > 0;

  const useUSDCPrice = useUSDCPricekHook[chainId];
  const currency0USDPrice = useUSDCPrice(stakingInfo?.rewardTokens?.[0]);
  const rewardAmountUSDPrice: number = currency0USDPrice
    ? Number(currency0USDPrice.toFixed()) * Number(stakingInfo?.rewardRatePerWeek?.toSignificant(4))
    : 0;

  const { earnedAmount } = useGetEarnedAmount(stakingInfo?.pid as string);

  const newEarnedAmount = version < 2 ? stakingInfo?.earnedAmount : earnedAmount;

  return (
    <Wrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text color="text1" fontSize={[28, 22]} fontWeight={700}>
          {t('dashboardPage.earned')}
        </Text>

        <Button variant="primary" width="100px" height="30px" onClick={() => setShowRemoveDrawer(true)}>
          {t('removeLiquidity.remove')}
        </Button>
      </Box>

      <Box flex="1">
        <InnerWrapper>
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Text textAlign={'center'} color={'text1'} fontSize={16}>
              {t('dashboardPage.earned_accruedReward')}
            </Text>
          </Box>
          <Box display={'flex'} style={{ gap: '20px' }} justifyContent={'center'} flexDirection={'row'}>
            <Box>
              <Stat
                stat={`${newEarnedAmount?.toFixed(isSuperFarm ? 2 : 6) ?? '0'}`}
                titlePosition="top"
                statFontSize={[36, 34]}
                statAlign="center"
                currency={stakingInfo?.rewardTokens?.[0]}
              />
            </Box>
            {isSuperFarm && (
              <>
                {(rewardTokensAmount || []).map((reward, index) => {
                  return (
                    <Box key={index}>
                      <Stat
                        stat={`${reward?.toFixed(Math.min(2, reward.token?.decimals)) ?? '0'}`}
                        titlePosition="top"
                        statFontSize={[36, 34]}
                        statAlign="center"
                        currency={reward?.token}
                      />
                    </Box>
                  );
                })}
              </>
            )}
          </Box>
          {(rewardTokensAmount || []).map((reward, index) => {
            // TODO:
            // It would not work if more than 2 tokens
            return totalUSD !== 0 ? (
              <Box pt={30} key={rewardTokensAmount.length}>
                <Text color="text1" fontSize={[12, 10]} fontWeight={400} textAlign={'center'}>
                  {t('dashboardPage.earned_yourWeeklyIncome', {
                    coinSymbol: usdc?.symbol,
                    value: Number(rewardAmountUSDPrice + totalUSD)?.toFixed(6) ?? '-',
                  })}
                </Text>
              </Box>
            ) : (
              <EarnedCalculation
                key={index}
                setTotalUSD={setTotalUSD}
                useUSDCPrice={useUSDCPrice}
                totalUSD={totalUSD}
                reward={reward}
                stakingInfo={stakingInfo}
                index={index}
              />
            );
          })}
        </InnerWrapper>
        {totalUSD === 0 && (
          <Box pt={30}>
            <Text color="text1" fontSize={[12, 10]} fontWeight={400} textAlign={'center'}>
              {t('dashboardPage.earned_yourWeeklyIncome', {
                coinSymbol: usdc?.symbol,
                value: rewardAmountUSDPrice?.toFixed(6) ?? '-',
              })}
            </Text>
          </Box>
        )}
      </Box>

      <Box mt={10}>
        <Button
          padding="15px 18px"
          isDisabled={!newEarnedAmount?.greaterThan(BIG_INT_ZERO)}
          variant="primary"
          onClick={() => setShowClaimDrawer(true)}
        >
          {t('earnPage.claim')}
        </Button>
      </Box>

      <ClaimDrawer
        isOpen={isClaimDrawerVisible}
        onClose={() => {
          setShowClaimDrawer(false);
        }}
        stakingInfo={stakingInfo}
        version={version}
      />
      <RemoveDrawer
        isOpen={isRemoveDrawerVisible}
        onClose={() => {
          setShowRemoveDrawer(false);
        }}
        stakingInfo={stakingInfo}
        version={version}
      />
    </Wrapper>
  );
};
export default EarnedDetail;
