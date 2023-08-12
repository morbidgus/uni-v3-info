import React, { useMemo, useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useColor } from 'hooks/useColor'
import { ThemedBackground, PageWrapper } from 'pages/styled'
import { feeTierPercent, getEtherscanLink } from 'utils'
import { AutoColumn, ColumnCenter, ColumnEnd, ColumnStart } from 'components/Column'
import { RowBetween, RowFixed, AutoRow, RowFlat } from 'components/Row'
import { TYPE, StyledInternalLink } from 'theme'
import Loader, { LocalLoader } from 'components/Loader'
import { ExternalLink, Download } from 'react-feather'
import { ExternalLink as StyledExternalLink } from '../../theme/components'
import useTheme from 'hooks/useTheme'
import CurrencyLogo from 'components/CurrencyLogo'
import { formatDollarAmount, formatAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { ButtonPrimary, ButtonGray, SavedIcon, SmallOptionButton } from 'components/Button'
import { DarkGreyCard, GreyCard, GreyBadge, ChartCard, DarkBlackCard } from 'components/Card'
import { usePoolDatas, usePoolChartData, usePoolTransactions } from 'state/pools/hooks'
import { unixToDate } from 'utils/date'
import { ToggleWrapper, ToggleElementFree, ToggleChartTypeElement } from 'components/Toggle/index'
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
import { VolumeWindow } from 'types'
import { useTransformedFeesData, useTransformedVolumeData } from 'hooks/chart'
import CalendarIcon from '../../assets/svg/calendar.svg'
import FireIcon from '../../assets/svg/chronos-fire.svg'

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

const ResponsiveRowCenter = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  align-items: center;
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

const WindowSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
  padding: 4px 8px;
  gap: 10px;
`

const SwitchOption = styled.span<{ active?: boolean }>`
  font-size: 14px;
  background: ${({ active }) => (active ? 'linear-gradient(67.55deg, #3f4ab3 4.5%, #7a64d0 95.77%)' : 'none')};
  -webkit-background-clip: text;
  -webkit-text-fill-color: ${({ active }) => (active ? 'transparent' : '#FFFFFF')};
  background-clip: text;
  color: ${({ active }) => (active ? 'transparent' : '#FFFFFF')};
`

const InfoWrapper = styled.div`
  display: flex;
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.bg1};
  padding: 20px 32px;
  height: 100%;
  justify-content: center;
  align-items: center;
  width: 60%;
`

const LeftAlignContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  justify-content: center;
`

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
`

const InfoSeparator = styled.div`
  height: 85%;
  width: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: absolute;
`
const TimeVolumeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const ChartTitle = styled.span`
  font-size: 25px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
font-size: 14px;
`};
`

const ChartSubTitle = styled.span`
  font-size: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
font-size: 10px;
`};
`

const SymbolLabel = styled(TYPE.label)`
  font-size: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
font-size: 18px;
`};
`

const InsightTypeSwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  background: ${({ theme }) => theme.gd2};
  gap: 12px;
`

const InsightTypeSwitchOption = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ theme, isActive }) => (isActive ? theme.gd1Hover : 'none')};
  padding: 10px ${({ isActive }) => (isActive ? '30px' : '15px')};
  border-radius: 20px;
  gap: 10px;
  cursor: pointer;
`

const PoolLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`

const TokensRow = styled.div`
  display: flex;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
align-items:center;
justify-content: center;
`}
`

const BreadCrumbsContainer = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToLarge`
margin-top: 60px;
`}
`

enum ChartView {
  VOL,
  PRICE,
  DENSITY,
  FEES,
}

export default function GaugePage({
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
  const [chartWindow, setChartWindow] = useState(VolumeWindow.weekly)
  const [latestValue, setLatestValue] = useState<number | undefined>()
  const [chartHoverValue, setChartHoverValue] = useState<any>()
  const [valueLabel, setValueLabel] = useState<string | undefined>()

  useEffect(() => {
    setLatestValue(undefined)
    setChartHoverValue(undefined)
  }, [activeNetwork])

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

  useEffect(() => {
    if (latestValue) {
      setChartHoverValue(formatDollarAmount(latestValue))
    } else if (view === ChartView.VOL) {
      setChartHoverValue(formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value))
    } else if (view === ChartView.DENSITY) {
      setChartHoverValue(formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value))
    }
  }, [latestValue])

  const weeklyVolumeData = useTransformedVolumeData(chartData, 'week')
  const monthlyVolumeData = useTransformedVolumeData(chartData, 'month')

  const weeklyFeesData = useTransformedFeesData(chartData, 'week')
  const monthlyFeesData = useTransformedFeesData(chartData, 'month')

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

  const ChartTypeSwitch: React.FC<any> = () => {
    return (
      <RowFixed>
        <ToggleChartTypeElement
          isActive={view === ChartView.VOL}
          fontSize="14px"
          onClick={() => setView(ChartView.VOL)}
        >
          Volume
        </ToggleChartTypeElement>
        <ToggleChartTypeElement
          isActive={view === ChartView.DENSITY}
          fontSize="14px"
          onClick={() => setView(ChartView.DENSITY)}
        >
          Liquidity
        </ToggleChartTypeElement>
        <ToggleChartTypeElement
          isActive={view === ChartView.FEES}
          fontSize="14px"
          onClick={() => setView(ChartView.FEES)}
        >
          Fees
        </ToggleChartTypeElement>
      </RowFixed>
    )
  }

  const ChartWindowSwitch: React.FC<any> = () => {
    return (
      <WindowSwitchContainer>
        <SmallOptionButton onClick={() => setChartWindow(VolumeWindow.daily)}>
          <SwitchOption active={chartWindow === VolumeWindow.daily}>D</SwitchOption>
        </SmallOptionButton>
        <SmallOptionButton style={{ marginLeft: '8px' }} onClick={() => setChartWindow(VolumeWindow.weekly)}>
          <SwitchOption active={chartWindow === VolumeWindow.weekly}>W</SwitchOption>
        </SmallOptionButton>
        <SmallOptionButton style={{ marginLeft: '8px' }} onClick={() => setChartWindow(VolumeWindow.monthly)}>
          <SwitchOption active={chartWindow === VolumeWindow.monthly}>M</SwitchOption>
        </SmallOptionButton>
      </WindowSwitchContainer>
    )
  }

  const getChartTitle = (): string => {
    switch (view) {
      case ChartView.VOL:
        return 'Volume'
      case ChartView.FEES:
        return 'Fees'
      default:
        return 'Liquidity'
    }
  }

  const getChartSubtitle = (): string => {
    switch (view) {
      case ChartView.VOL:
        return '24hs Volume'
      case ChartView.FEES:
        return 'Total Fees'
      default:
        return 'Total Density'
    }
  }

  const ChartValue: React.FC<any> = () => {
    return (
      <InfoWrapper>
        <InfoContainer>
          <LeftAlignContainer>
            <ChartTitle>{getChartTitle()}</ChartTitle>
            <TYPE.subHeader fontSize="12px">{getChartSubtitle()}</TYPE.subHeader>
          </LeftAlignContainer>
        </InfoContainer>
        <InfoSeparator />
        <InfoContainer>
          <LeftAlignContainer>
            <ChartTitle>{chartHoverValue}</ChartTitle>
            <TimeVolumeContainer>
              <img width={'20px'} height={'20px'} src={CalendarIcon} alt="Calendar" />
              <ChartSubTitle>{valueLabel ? <MonoSpace>{valueLabel}</MonoSpace> : 'All time'}</ChartSubTitle>
            </TimeVolumeContainer>
          </LeftAlignContainer>
        </InfoContainer>
      </InfoWrapper>
    )
  }

  const InsightTypeSwitch: React.FC<any> = () => {
    return (
      <InsightTypeSwitchContainer>
        <InsightTypeSwitchOption>
          <img src={FireIcon} height="19px" width="19px" alt="gauge-icon" />
          <TYPE.label fontSize="14px">Gauges</TYPE.label>
        </InsightTypeSwitchOption>
        <InsightTypeSwitchOption isActive>
          <TYPE.label fontSize="14px">Pools</TYPE.label>
        </InsightTypeSwitchOption>
      </InsightTypeSwitchContainer>
    )
  }

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={backgroundColor} />
      {poolData ? (
        <AutoColumn gap="32px">
          <BreadCrumbsContainer>
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
          </BreadCrumbsContainer>
          <PoolLayoutContainer>
            <ResponsiveRowCenter>
              <RowFixed align="center">
                <DoubleCurrencyLogo
                  address0={poolData.token0.address}
                  address1={poolData.token1.address}
                  size={40}
                  margin
                />
                <SymbolLabel>{` ${poolData.token0.symbol} / ${poolData.token1.symbol} `}</SymbolLabel>
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
              <InsightTypeSwitch />
            </ResponsiveRowCenter>
            <ResponsiveRowCenter>
              <TokensRow>
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
              </TokensRow>
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

                      <img src={ArrowRightIcon} height={15} width={15} alt="arrow" />
                    </ButtonPrimary>
                  </StyledExternalLink>
                </RowFixed>
              )}
            </ResponsiveRowCenter>
          </PoolLayoutContainer>
          <ContentLayout>
            <DarkBlackCard>
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
            </DarkBlackCard>
            <ChartCard>
              <ToggleRow align="flex-start" padding={'14px'}>
                <ChartValue />
                <ColumnEnd>
                  <ChartTypeSwitch />
                  {view !== ChartView.DENSITY && <ChartWindowSwitch />}
                </ColumnEnd>
              </ToggleRow>

              {view === ChartView.VOL ? (
                <BarChart
                  data={
                    chartWindow === VolumeWindow.monthly
                      ? monthlyVolumeData
                      : chartWindow === VolumeWindow.weekly
                      ? weeklyVolumeData
                      : formattedVolumeData
                  }
                  activeWindow={chartWindow}
                  color={backgroundColor}
                  minHeight={340}
                  setValue={setLatestValue}
                  setLabel={setValueLabel}
                  value={latestValue}
                  label={valueLabel}
                />
              ) : view === ChartView.FEES ? (
                <BarChart
                  data={
                    chartWindow === VolumeWindow.monthly
                      ? monthlyFeesData
                      : chartWindow === VolumeWindow.weekly
                      ? weeklyFeesData
                      : formattedFeesUSD
                  }
                  activeWindow={chartWindow}
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
            </ChartCard>
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
