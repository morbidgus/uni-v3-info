import React, { useMemo, useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useColor } from 'hooks/useColor'
import { ThemedBackground, PageWrapper } from 'pages/styled'
import { feeTierPercent, getEtherscanLink } from 'utils'
import { AutoColumn, ColumnCenter, ColumnStart } from 'components/Column'
import { RowBetween, RowFixed, AutoRow, RowFlat } from 'components/Row'
import { TYPE, StyledInternalLink } from 'theme'
import Loader, { LocalLoader } from 'components/Loader'
import { ExternalLink, Download } from 'react-feather'
import { ExternalLink as StyledExternalLink } from '../../theme/components'
import useTheme from 'hooks/useTheme'
import CurrencyLogo from 'components/CurrencyLogo'
import { formatDollarAmount, formatAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { ButtonPrimary, ButtonGray, SavedIcon } from 'components/Button'
import { DarkGreyCard, GreyCard, GreyBadge } from 'components/Card'
import { usePoolDatas, usePoolChartData, usePoolTransactions } from 'state/pools/hooks'
import { unixToDate } from 'utils/date'
import { ToggleWrapper, ToggleElementFree } from 'components/Toggle/index'
import BarChart from 'components/BarChart/alt'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import TransactionTable from 'components/TransactionsTable'
import { useSavedPools } from 'state/user/hooks'
import DensityChart from 'components/DensityChart'
import { MonoSpace } from 'components/shared'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { networkPrefix } from 'utils/networkPrefix'
import { EthereumNetworkInfo } from 'constants/networks'
import { GenericImageWrapper } from 'components/Logo'
import FavoriteFilledIcon from '../../assets/svg/favorite-star-filled.svg'
import FavoriteIcon from '../../assets/svg/favorite-star.svg'
import OpenNewTabIcon from '../../assets/svg/open-new-tab.svg'
import ArrowRightIcon from '../../assets/svg/arrow-right.svg'
import DownloadIcon from '../../assets/svg/download.svg'
import LockIcon from '../../assets/svg/lock-icon.svg'
import Row from 'components/Row'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import ArrowDownIcon from '../../assets/svg/arrow-down.svg'
import TVLLockIcon from '../../assets/svg/lock.svg'
import EqualizerIcon from '../../assets/svg/equalizer.svg'
import InsightsIcon from '../../assets/svg/insights.svg'

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 1em;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const TokenButton = styled.div`
  background-color: #2e293f;
  padding: 8px 12px;
  border-radius: 20px;
  margin-right: 12px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
    row-gap: 24px;
    width: 100%:
  `};
`

const ToggleRow = styled(RowBetween)`
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`

const FavoriteWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 14px;
`

const TTLContainer = styled(Row)`
  gap: 8px;
`

const LabelContainer = styled.div`
  background-color: ${({ theme }) => theme.bgWhiteOpacity};
  border-radius: 20px;
  padding: 0 8px;
`

const InfoValueChange = styled.div<{ isNegative?: boolean }>`
  display: flex;
  align-items: center;
  border: 1px solid ${({ isNegative }) => (isNegative ? '#FF2A5F' : '#27F291')}
  border-radius: 20px;
  padding: 5px 10px;
`

const ChangeValue = styled.span<{ isNegative?: boolean }>`
  color: ${({ isNegative }) => (isNegative ? '#FF2A5F' : '#27F291')};
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 10px;
  `};
`

enum ChartView {
  VOL,
  PRICE,
  DENSITY,
  FEES,
}

export default function PoolPage({
  match: {
    params: { address },
  },
}: RouteComponentProps<{ address: string }>) {
  const [activeNetwork] = useActiveNetworkVersion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // theming
  const backgroundColor = useColor()
  const theme = useTheme()

  // token data
  const poolData = usePoolDatas([address])[0]
  const chartData = usePoolChartData(address)
  const transactions = usePoolTransactions(address)

  const [view, setView] = useState(ChartView.VOL)
  const [latestValue, setLatestValue] = useState<number | undefined>()
  const [valueLabel, setValueLabel] = useState<string | undefined>()

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.totalValueLockedUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.volumeUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  const formattedFeesUSD = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.feesUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  //watchlist
  const [savedPools, addSavedPool] = useSavedPools()

  const PercentageChageElement: React.FC<any> = ({ percentageChange }: any) => {
    const truncated = parseFloat(percentageChange?.toFixed(2))

    return (
      <InfoValueChange isNegative={truncated < 0}>
        {truncated > 0 ? (
          <img width="17px" height="17px" alt="arrow" src={ArrowUpIcon} />
        ) : (
          <img width="17px" height="17px" alt="arrow" src={ArrowDownIcon} />
        )}

        <ChangeValue isNegative={truncated < 0}>{Math.abs(percentageChange).toFixed(2)}%</ChangeValue>
      </InfoValueChange>
    )
  }

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={backgroundColor} />
      {poolData ? (
        <AutoColumn gap="32px">
          <RowBetween>
            <AutoRow gap="4px">
              <StyledInternalLink to={networkPrefix(activeNetwork)}>
                <TYPE.main>{`Home > `}</TYPE.main>
              </StyledInternalLink>
              <StyledInternalLink to={networkPrefix(activeNetwork) + 'pools'}>
                <TYPE.label>{` Pools `}</TYPE.label>
              </StyledInternalLink>
              <TYPE.main>{` > `}</TYPE.main>
              <TYPE.label>{` ${poolData.token0.symbol} / ${poolData.token1.symbol} ${feeTierPercent(
                poolData.feeTier
              )} `}</TYPE.label>
            </AutoRow>
          </RowBetween>
          <ResponsiveRow align="flex-end">
            <AutoColumn gap="lg">
              <RowFixed align="center">
                <DoubleCurrencyLogo
                  address0={poolData.token0.address}
                  address1={poolData.token1.address}
                  size={40}
                  margin
                />
                <TYPE.label
                  ml="8px"
                  mr="8px"
                  fontSize="30px"
                >{` ${poolData.token0.symbol} / ${poolData.token1.symbol} `}</TYPE.label>
                <GreyBadge>{feeTierPercent(poolData.feeTier)}</GreyBadge>
                {activeNetwork === EthereumNetworkInfo ? null : (
                  <GenericImageWrapper src={activeNetwork.imageURL} style={{ marginLeft: '8px' }} size={'40px'} />
                )}
                <FavoriteWrapper onClick={() => addSavedPool(address)}>
                  {savedPools.includes(address) ? (
                    <img src={FavoriteFilledIcon} height="27px" width="27px" alt="star" />
                  ) : (
                    <img src={FavoriteIcon} height="27px" width="27px" alt="star" />
                  )}
                </FavoriteWrapper>

                <StyledExternalLink href={getEtherscanLink(1, address, 'address', activeNetwork)}>
                  <img src={OpenNewTabIcon} height="23px" width="23px" alt="open in new tab" />
                </StyledExternalLink>
              </RowFixed>

              <ResponsiveRow>
                <StyledInternalLink to={networkPrefix(activeNetwork) + 'tokens/' + poolData.token0.address}>
                  <TokenButton>
                    <RowFixed>
                      <CurrencyLogo address={poolData.token0.address} size={'20px'} />
                      <TYPE.label fontSize="14px" ml="8px" style={{ whiteSpace: 'nowrap' }} width={'fit-content'}>
                        {`1 ${poolData.token0.symbol} =  ${formatAmount(poolData.token1Price, 4)} ${
                          poolData.token1.symbol
                        }`}
                      </TYPE.label>
                    </RowFixed>
                  </TokenButton>
                </StyledInternalLink>
                <StyledInternalLink to={networkPrefix(activeNetwork) + 'tokens/' + poolData.token1.address}>
                  <TokenButton>
                    <RowFixed>
                      <CurrencyLogo address={poolData.token1.address} size={'20px'} />
                      <TYPE.label fontSize="14px" ml="8px" style={{ whiteSpace: 'nowrap' }} width={'fit-content'}>
                        {`1 ${poolData.token1.symbol} =  ${formatAmount(poolData.token0Price, 4)} ${
                          poolData.token0.symbol
                        }`}
                      </TYPE.label>
                    </RowFixed>
                  </TokenButton>
                </StyledInternalLink>
              </ResponsiveRow>
            </AutoColumn>
            {activeNetwork !== EthereumNetworkInfo ? null : (
              <RowFixed>
                <StyledExternalLink
                  href={`https://app.uniswap.org/#/add/${poolData.token0.address}/${poolData.token1.address}/${poolData.feeTier}`}
                >
                  <ButtonGray mr="12px">
                    <div style={{ display: 'flex', alignItems: 'center' }}>Add Liquidity</div>
                    <img src={DownloadIcon} height={20} width={20} alt="add" />
                  </ButtonGray>
                </StyledExternalLink>
                <StyledExternalLink
                  href={`https://app.uniswap.org/#/swap?inputCurrency=${poolData.token0.address}&outputCurrency=${poolData.token1.address}`}
                >
                  <ButtonPrimary>
                    <TYPE.label fontSize="14px">Trade</TYPE.label>

                    <img src={ArrowRightIcon} height={20} width={20} alt="arrow" />
                  </ButtonPrimary>
                </StyledExternalLink>
              </RowFixed>
            )}
          </ResponsiveRow>
          <ContentLayout>
            <DarkGreyCard>
              <AutoColumn gap="lg">
                <GreyCard padding="16px" noBorder>
                  <AutoColumn gap="md">
                    <TTLContainer>
                      <img src={LockIcon} height={23} width={23} alt="lock" />
                      <TYPE.main>Total Tokens Locked</TYPE.main>
                    </TTLContainer>
                    <RowBetween gradientBg={theme.gd2} padding={'14px'}>
                      <RowFixed gap="8px">
                        <CurrencyLogo address={poolData.token0.address} size={'36px'} />
                        <ColumnStart>
                          <TYPE.label fontSize="14px">{poolData.token0.symbol}</TYPE.label>
                          <LabelContainer>
                            <TYPE.label fontSize="11px">{poolData.token0.name}</TYPE.label>
                          </LabelContainer>
                        </ColumnStart>
                      </RowFixed>
                      <TYPE.label fontSize="20px">{formatAmount(poolData.tvlToken0)}</TYPE.label>
                    </RowBetween>
                    <RowBetween gradientBg={theme.gd2} padding={'14px'}>
                      <RowFixed gap="8px">
                        <CurrencyLogo address={poolData.token1.address} size={'36px'} />
                        <ColumnStart>
                          <TYPE.label fontSize="14px">{poolData.token1.symbol}</TYPE.label>
                          <LabelContainer>
                            <TYPE.label fontSize="11px">{poolData.token1.name}</TYPE.label>
                          </LabelContainer>
                        </ColumnStart>
                      </RowFixed>
                      <TYPE.label fontSize="20px">{formatAmount(poolData.tvlToken1)}</TYPE.label>
                    </RowBetween>
                  </AutoColumn>
                </GreyCard>
                <RowBetween border={`1px solid ${theme.border1}`} align="center" padding={'14px'}>
                  <RowFixed>
                    <img src={TVLLockIcon} height={35} width={35} alt="TVLLock" />
                    <ColumnStart>
                      <TYPE.main fontWeight={400} fontSize="14px">
                        TVL
                      </TYPE.main>
                      <TYPE.label fontSize="18px">{formatDollarAmount(poolData.tvlUSD)}</TYPE.label>
                    </ColumnStart>
                  </RowFixed>

                  <PercentageChageElement percentageChange={poolData.tvlUSDChange} />
                </RowBetween>

                <RowBetween border={`1px solid ${theme.border1}`} align="center" padding={'14px'}>
                  <RowFixed>
                    <img src={EqualizerIcon} height={35} width={35} alt="TVLLock" />
                    <ColumnStart>
                      <TYPE.main fontWeight={400} fontSize="14px">
                        24h Volume
                      </TYPE.main>
                      <TYPE.label fontSize="18px">{formatDollarAmount(poolData.volumeUSD)}</TYPE.label>
                    </ColumnStart>
                  </RowFixed>

                  <PercentageChageElement percentageChange={poolData.volumeUSDChange} />
                </RowBetween>

                <RowBetween border={`1px solid ${theme.border1}`} align="center" padding={'14px'}>
                  <RowFixed>
                    <img src={InsightsIcon} height={35} width={35} alt="TVLLock" />
                    <ColumnStart>
                      <TYPE.main fontWeight={400} fontSize="14px">
                        24h Fees
                      </TYPE.main>
                      <TYPE.label fontSize="18px">
                        {formatDollarAmount(poolData.volumeUSD * (poolData.feeTier / 1000000))}
                      </TYPE.label>
                    </ColumnStart>
                  </RowFixed>
                </RowBetween>
              </AutoColumn>
            </DarkGreyCard>
            <DarkGreyCard>
              <ToggleRow align="flex-start">
                <AutoColumn>
                  <TYPE.label fontSize="24px" height="30px">
                    <MonoSpace>
                      {latestValue
                        ? formatDollarAmount(latestValue)
                        : view === ChartView.VOL
                        ? formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
                        : view === ChartView.DENSITY
                        ? ''
                        : formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)}{' '}
                    </MonoSpace>
                  </TYPE.label>
                  <TYPE.main height="20px" fontSize="12px">
                    {valueLabel ? <MonoSpace>{valueLabel}</MonoSpace> : ''}
                  </TYPE.main>
                </AutoColumn>
                <ToggleWrapper width="240px">
                  <ToggleElementFree
                    isActive={view === ChartView.VOL}
                    fontSize="12px"
                    onClick={() => (view === ChartView.VOL ? setView(ChartView.DENSITY) : setView(ChartView.VOL))}
                  >
                    Volume
                  </ToggleElementFree>
                  <ToggleElementFree
                    isActive={view === ChartView.DENSITY}
                    fontSize="12px"
                    onClick={() => (view === ChartView.DENSITY ? setView(ChartView.VOL) : setView(ChartView.DENSITY))}
                  >
                    Liquidity
                  </ToggleElementFree>
                  <ToggleElementFree
                    isActive={view === ChartView.FEES}
                    fontSize="12px"
                    onClick={() => (view === ChartView.FEES ? setView(ChartView.VOL) : setView(ChartView.FEES))}
                  >
                    Fees
                  </ToggleElementFree>
                </ToggleWrapper>
              </ToggleRow>
              {view === ChartView.VOL ? (
                <BarChart
                  data={formattedVolumeData}
                  color={backgroundColor}
                  minHeight={340}
                  setValue={setLatestValue}
                  setLabel={setValueLabel}
                  value={latestValue}
                  label={valueLabel}
                />
              ) : view === ChartView.FEES ? (
                <BarChart
                  data={formattedFeesUSD}
                  color={backgroundColor}
                  minHeight={340}
                  setValue={setLatestValue}
                  setLabel={setValueLabel}
                  value={latestValue}
                  label={valueLabel}
                />
              ) : (
                <DensityChart address={address} />
              )}
            </DarkGreyCard>
          </ContentLayout>
          <TYPE.main fontSize="24px">Transactions</TYPE.main>
          <DarkGreyCard>
            {transactions ? <TransactionTable transactions={transactions} /> : <LocalLoader fill={false} />}
          </DarkGreyCard>
        </AutoColumn>
      ) : (
        <Loader />
      )}
    </PageWrapper>
  )
}
