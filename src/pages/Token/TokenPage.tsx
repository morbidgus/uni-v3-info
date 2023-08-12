import React, { useMemo, useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import {
  useTokenData,
  usePoolsForToken,
  useTokenChartData,
  useTokenPriceData,
  useTokenTransactions,
} from 'state/tokens/hooks'
import styled from 'styled-components'
import { useColor } from 'hooks/useColor'
import ReactGA from 'react-ga'
import { ThemedBackground, PageWrapper } from 'pages/styled'
import { shortenAddress, getEtherscanLink, currentTimestamp } from 'utils'
import { AutoColumn, ColumnEnd, ColumnStart } from 'components/Column'
import { RowBetween, RowFixed, AutoRow, RowFlat } from 'components/Row'
import { TYPE, StyledInternalLink } from 'theme'
import Loader, { LocalLoader } from 'components/Loader'
import { ExternalLink } from 'react-feather'
import { ExternalLink as StyledExternalLink } from '../../theme/components'
import useTheme from 'hooks/useTheme'
import CurrencyLogo from 'components/CurrencyLogo'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { ButtonPrimary, ButtonGray, SavedIcon, SmallOptionButton } from 'components/Button'
import { ChartCard, DarkBlackCard, DarkGreyCard, LightGreyCard } from 'components/Card'
import { usePoolDatas } from 'state/pools/hooks'
import PoolTable from 'components/pools/PoolTable'
import LineChart from 'components/LineChart/alt'
import { unixToDate } from 'utils/date'
import { ToggleWrapper, ToggleElementFree, ToggleChartTypeElement } from 'components/Toggle/index'
import BarChart from 'components/BarChart/alt'
import CandleChart from 'components/CandleChart'
import TransactionTable from 'components/TransactionsTable'
import { useSavedTokens } from 'state/user/hooks'
import { ONE_HOUR_SECONDS, TimeWindow } from 'constants/intervals'
import { MonoSpace } from 'components/shared'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { networkPrefix } from 'utils/networkPrefix'
import { EthereumNetworkInfo } from 'constants/networks'
import { GenericImageWrapper } from 'components/Logo'
import { useCMCLink } from 'hooks/useCMCLink'
import ArrowRightIcon from '../../assets/svg/arrow-right.svg'
import DownloadIcon from '../../assets/svg/download.svg'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import ArrowDownIcon from '../../assets/svg/arrow-down.svg'
import TVLLockIcon from '../../assets/svg/lock.svg'
import EqualizerIcon from '../../assets/svg/equalizer.svg'
import InsightsIcon from '../../assets/svg/insights.svg'
import CalendarIcon from '../../assets/svg/calendar.svg'
import FavoriteFilledIcon from '../../assets/svg/favorite-star-filled.svg'
import FavoriteIcon from '../../assets/svg/favorite-star.svg'
import OpenNewTabIcon from '../../assets/svg/open-new-tab.svg'
import { VolumeWindow } from 'types'
import { useTransformedTotalValueLockedUSDData, useTransformedVolumeData } from 'hooks/chart'

const PriceText = styled(TYPE.label)`
  font-size: 35px;
  line-height: 0.8;
`

const ContentLayout = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-gap: 1em;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
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

const StyledCMCLogo = styled.img`
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
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

const ToggleRow = styled(RowBetween)`
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
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

const FavoriteWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 14px;
`

const CustomAutoColumn = styled(AutoColumn)`
  margin-top: 40px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top: 60px;
  `};
`

enum ChartView {
  TVL,
  VOL,
  PRICE,
}

const DEFAULT_TIME_WINDOW = TimeWindow.WEEK

export default function TokenPage({
  match: {
    params: { address },
  },
}: RouteComponentProps<{ address: string }>) {
  const [activeNetwork] = useActiveNetworkVersion()

  address = address.toLowerCase()
  // theming
  const backgroundColor = useColor(address)
  const theme = useTheme()

  // scroll on page view
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const tokenData = useTokenData(address)
  const poolsForToken = usePoolsForToken(address)
  const poolDatas = usePoolDatas(poolsForToken ?? [])
  const transactions = useTokenTransactions(address)
  const chartData = useTokenChartData(address)

  // check for link to CMC
  const cmcLink = useCMCLink(address)

  // format for chart component
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

  // chart labels
  const [view, setView] = useState(ChartView.PRICE)
  const [chartWindow, setChartWindow] = useState(VolumeWindow.weekly)
  const [latestValue, setLatestValue] = useState<number | undefined>()
  const [valueLabel, setValueLabel] = useState<string | undefined>()
  const [chartHoverValue, setChartHoverValue] = useState<any>()
  const [truncatedUSDChange, setTruncatedUSDChange] = useState<any>()
  const [timeWindow] = useState(DEFAULT_TIME_WINDOW)

  useEffect(() => {
    setLatestValue(undefined)
    setChartHoverValue(undefined)
  }, [activeNetwork])

  useEffect(() => {
    if (latestValue) {
      setChartHoverValue(formatDollarAmount(latestValue, 2))
    } else if (view === ChartView.VOL) {
      setChartHoverValue(formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value))
    } else if (view === ChartView.TVL) {
      setChartHoverValue(formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value))
    } else if (view === ChartView.PRICE && tokenData) {
      setChartHoverValue(formatDollarAmount(tokenData.priceUSD, 2))
    }
  }, [latestValue, tokenData])

  // pricing data
  const priceData = useTokenPriceData(address, ONE_HOUR_SECONDS, timeWindow)
  const adjustedToCurrent = useMemo(() => {
    if (priceData && tokenData && priceData.length > 0) {
      const adjusted = Object.assign([], priceData)
      adjusted.push({
        time: currentTimestamp() / 1000,
        open: priceData[priceData.length - 1].close,
        close: tokenData?.priceUSD,
        high: tokenData?.priceUSD,
        low: priceData[priceData.length - 1].close,
      })
      return adjusted
    } else {
      return undefined
    }
  }, [priceData, tokenData])

  const weeklyVolumeData = useTransformedVolumeData(chartData, 'week')
  const monthlyVolumeData = useTransformedVolumeData(chartData, 'month')

  const weeklyTVLData = useTransformedTotalValueLockedUSDData(chartData, 'week')
  const monthlyTVLData = useTransformedTotalValueLockedUSDData(chartData, 'month')

  // watchlist
  const [savedTokens, addSavedToken] = useSavedTokens()

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

  const getChartTitle = (): string => {
    switch (view) {
      case ChartView.VOL:
        return 'Volume'
      case ChartView.TVL:
        return 'TVL'
      default:
        return 'Price'
    }
  }

  const getChartSubtitle = (): string => {
    switch (view) {
      case ChartView.VOL:
        return '24hs Volume'
      case ChartView.TVL:
        return 'Total Value Locked'
      default:
        return 'Total Price'
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

  const ChartTypeSwitch: React.FC<any> = () => {
    return (
      <RowFixed>
        <ToggleChartTypeElement
          isActive={view === ChartView.PRICE}
          fontSize="14px"
          onClick={() => setView(ChartView.PRICE)}
        >
          Price
        </ToggleChartTypeElement>
        <ToggleChartTypeElement
          isActive={view === ChartView.TVL}
          fontSize="14px"
          onClick={() => setView(ChartView.TVL)}
        >
          TVL
        </ToggleChartTypeElement>
        <ToggleChartTypeElement
          isActive={view === ChartView.VOL}
          fontSize="14px"
          onClick={() => setView(ChartView.VOL)}
        >
          Volume
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

  useEffect(() => {
    if (tokenData) {
      setTruncatedUSDChange(parseFloat(tokenData.priceUSDChange?.toFixed(2)))
    }
  }, [tokenData])

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={backgroundColor} />
      {tokenData ? (
        !tokenData.exists ? (
          <LightGreyCard style={{ textAlign: 'center' }}>
            No pool has been created with this token yet. Create one
            <StyledExternalLink style={{ marginLeft: '4px' }} href={`https://app.uniswap.org/#/add/${address}`}>
              here.
            </StyledExternalLink>
          </LightGreyCard>
        ) : (
          <AutoColumn gap="32px">
            <CustomAutoColumn>
              <RowBetween>
                <AutoRow gap="4px">
                  <StyledInternalLink to={networkPrefix(activeNetwork)}>
                    <TYPE.main fontSize="12px" color={theme.textWithOpacity}>{`Home > `}</TYPE.main>
                  </StyledInternalLink>
                  <StyledInternalLink to={networkPrefix(activeNetwork) + 'tokens'}>
                    <TYPE.main fontSize="12px" color={theme.textWithOpacity}>{` Tokens `}</TYPE.main>
                  </StyledInternalLink>
                  <TYPE.main fontSize="12px" color={theme.textWithOpacity}>{` > `}</TYPE.main>
                  <TYPE.main fontSize="12px" color={theme.textWithOpacity}>{` ${tokenData.symbol} `}</TYPE.main>
                </AutoRow>
                <RowFixed align="center" justify="center">
                  <FavoriteWrapper onClick={() => addSavedToken(address)}>
                    {savedTokens.includes(address) ? (
                      <img src={FavoriteFilledIcon} height="27px" width="27px" alt="star" />
                    ) : (
                      <img src={FavoriteIcon} height="27px" width="27px" alt="star" />
                    )}
                  </FavoriteWrapper>
                  <StyledExternalLink href={getEtherscanLink(1, address, 'address', activeNetwork)}>
                    <img src={OpenNewTabIcon} height="23px" width="23px" alt="open in new tab" />
                  </StyledExternalLink>
                </RowFixed>
              </RowBetween>
              <ResponsiveRow align="flex-end">
                <AutoColumn gap="md">
                  <RowFixed gap="lg">
                    <CurrencyLogo address={address} size="25px" />
                    <TYPE.label ml={'10px'} fontSize="16px">
                      {tokenData.name}
                    </TYPE.label>
                    <TYPE.main ml={'6px'} fontSize="16px" color={theme.textWithOpacity}>
                      ({tokenData.symbol})
                    </TYPE.main>
                    {activeNetwork === EthereumNetworkInfo ? null : (
                      <GenericImageWrapper src={activeNetwork.imageURL} style={{ marginLeft: '8px' }} size={'26px'} />
                    )}
                  </RowFixed>
                  <RowFlat style={{ marginTop: '8px' }}>
                    <PriceText mr="10px"> {formatDollarAmount(tokenData.priceUSD)}</PriceText>
                    <InfoValueChange isNegative={truncatedUSDChange < 0}>
                      {truncatedUSDChange > 0 ? (
                        <img width="17px" height="17px" alt="arrow" src={ArrowUpIcon} />
                      ) : (
                        <img width="17px" height="17px" alt="arrow" src={ArrowDownIcon} />
                      )}

                      <ChangeValue isNegative={truncatedUSDChange < 0}>
                        {Math.abs(tokenData.priceUSDChange).toFixed(2)}%
                      </ChangeValue>
                    </InfoValueChange>
                  </RowFlat>
                </AutoColumn>
                {activeNetwork !== EthereumNetworkInfo ? null : (
                  <RowFixed>
                    <StyledExternalLink href={`https://app.uniswap.org/#/add/${address}`}>
                      <ButtonGray mr="12px">
                        <div style={{ display: 'flex', alignItems: 'center' }}>Add Liquidity</div>
                        <img src={DownloadIcon} height={20} width={20} alt="add" />
                      </ButtonGray>
                    </StyledExternalLink>
                    <StyledExternalLink href={`https://app.uniswap.org/#/swap?inputCurrency=${address}`}>
                      <ButtonPrimary>
                        <TYPE.label fontSize="14px">Trade</TYPE.label>

                        <img src={ArrowRightIcon} height={15} width={15} alt="arrow" />
                      </ButtonPrimary>
                    </StyledExternalLink>
                  </RowFixed>
                )}
              </ResponsiveRow>
            </CustomAutoColumn>
            <ContentLayout>
              <DarkBlackCard>
                <AutoColumn gap="lg">
                  <RowBetween border={`1px solid ${theme.border1}`} align="center" padding={'14px'}>
                    <RowFixed>
                      <img src={TVLLockIcon} height={35} width={35} alt="TVLLock" />
                      <ColumnStart>
                        <TYPE.main fontWeight={400} fontSize="14px">
                          TVL
                        </TYPE.main>
                        <TYPE.label fontSize="18px">{formatDollarAmount(tokenData.tvlUSD)}</TYPE.label>
                      </ColumnStart>
                    </RowFixed>

                    <PercentageChageElement percentageChange={tokenData.tvlUSDChange} />
                  </RowBetween>

                  <RowBetween border={`1px solid ${theme.border1}`} align="center" padding={'14px'}>
                    <RowFixed>
                      <img src={EqualizerIcon} height={35} width={35} alt="Equalizer" />
                      <ColumnStart>
                        <TYPE.main fontWeight={400} fontSize="14px">
                          24h Trading Vol
                        </TYPE.main>
                        <TYPE.label fontSize="18px">{formatDollarAmount(tokenData.volumeUSD)}</TYPE.label>
                      </ColumnStart>
                    </RowFixed>

                    <PercentageChageElement percentageChange={tokenData.volumeUSDChange} />
                  </RowBetween>

                  <RowBetween border={`1px solid ${theme.border1}`} align="center" padding={'14px'}>
                    <RowFixed>
                      <img src={EqualizerIcon} height={35} width={35} alt="Equalizer" />
                      <ColumnStart>
                        <TYPE.main fontWeight={400} fontSize="14px">
                          7d Trading Vol
                        </TYPE.main>
                        <TYPE.label fontSize="18px">{formatDollarAmount(tokenData.volumeUSDWeek)}</TYPE.label>
                      </ColumnStart>
                    </RowFixed>
                  </RowBetween>

                  <RowBetween border={`1px solid ${theme.border1}`} align="center" padding={'14px'}>
                    <RowFixed>
                      <img src={InsightsIcon} height={35} width={35} alt="Insight" />
                      <ColumnStart>
                        <TYPE.main fontWeight={400} fontSize="14px">
                          24hs Fees
                        </TYPE.main>
                        <TYPE.label fontSize="18px">{formatDollarAmount(tokenData.feesUSD)}</TYPE.label>
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

                    {view !== ChartView.PRICE && <ChartWindowSwitch />}
                  </ColumnEnd>
                </ToggleRow>

                {view === ChartView.TVL ? (
                  <LineChart
                    data={
                      chartWindow === VolumeWindow.monthly
                        ? monthlyTVLData
                        : chartWindow === VolumeWindow.weekly
                        ? weeklyTVLData
                        : formattedTvlData
                    }
                    minHeight={340}
                    value={latestValue}
                    label={valueLabel}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                    activeWindow={chartWindow}
                  />
                ) : view === ChartView.VOL ? (
                  <BarChart
                    data={
                      chartWindow === VolumeWindow.monthly
                        ? monthlyVolumeData
                        : chartWindow === VolumeWindow.weekly
                        ? weeklyVolumeData
                        : formattedVolumeData
                    }
                    color={backgroundColor}
                    minHeight={340}
                    value={latestValue}
                    label={valueLabel}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                    activeWindow={chartWindow}
                  />
                ) : view === ChartView.PRICE ? (
                  adjustedToCurrent ? (
                    <CandleChart
                      data={adjustedToCurrent}
                      setValue={setLatestValue}
                      setLabel={setValueLabel}
                      color={backgroundColor}
                    />
                  ) : (
                    <LocalLoader fill={false} />
                  )
                ) : null}
              </ChartCard>
            </ContentLayout>
            <TYPE.main>Pools</TYPE.main>
            <DarkGreyCard>
              <PoolTable poolDatas={poolDatas} />
            </DarkGreyCard>
            <TYPE.main>Transactions</TYPE.main>
            <DarkGreyCard>
              {transactions ? (
                <TransactionTable transactions={transactions} color={backgroundColor} />
              ) : (
                <LocalLoader fill={false} />
              )}
            </DarkGreyCard>
          </AutoColumn>
        )
      ) : (
        <Loader />
      )}
    </PageWrapper>
  )
}
