import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { ResponsiveRow, RowBetween, RowFixed, TableRowBetween } from 'components/Row'
import LineChart from 'components/LineChart/alt'
import useTheme from 'hooks/useTheme'
import { useProtocolChartData, useProtocolData, useProtocolTransactions } from 'state/protocol/hooks'
import { DarkGreyCard } from 'components/Card'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { HideMedium, HideSmall, StyledInternalLink } from '../../theme/components'
import TokenTable from 'components/tokens/TokenTable'
import PoolTable from 'components/pools/PoolTable'
import { PageWrapper, ThemedBackgroundGlobal } from 'pages/styled'
import { unixToDate } from 'utils/date'
import BarChart from 'components/BarChart/alt'
import { useAllPoolData } from 'state/pools/hooks'
import { notEmpty } from 'utils'
import TransactionsTable from '../../components/TransactionsTable'
import { useAllTokenData } from 'state/tokens/hooks'
import { MonoSpace } from 'components/shared'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { useTransformedVolumeData, useTransformedTVLData } from 'hooks/chart'
import { SmallOptionButton } from 'components/Button'
import { VolumeWindow } from 'types'
import CalendarIcon from '../../assets/svg/calendar.svg'
import EqualizerIcon from '../../assets/svg/equalizer.svg'
import InsightsIcon from '../../assets/svg/insights.svg'
import LockIcon from '../../assets/svg/lock.svg'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import ArrowDownIcon from '../../assets/svg/arrow-down.svg'
import { Link } from 'react-router-dom'
import ArrowRightIcon from '../../assets/svg/arrow-right.svg'

interface DailyInfoElementProps {
  title: string
  icon: any
  value: string
  percentageChange?: number
}

const ChartWrapper = styled.div`
  width: 49%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`

const InfoWrapper = styled.div`
  display: flex;
  position: relative;
  border-radius: 20px;
  background-color: rgba(53, 49, 71, 0.53);
  padding: 12px 32px;
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
const WindowSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #36314e;
  border-radius: 20px;
`

const SwitchOption = styled.span<{ active?: boolean }>`
  font-size: 14px;
  background: ${({ active }) => (active ? 'linear-gradient(67.55deg, #3f4ab3 4.5%, #7a64d0 95.77%)' : 'none')};
  -webkit-background-clip: text;
  -webkit-text-fill-color: ${({ active }) => (active ? 'transparent' : '#FFFFFF')};
  background-clip: text;
  color: ${({ active }) => (active ? 'transparent' : '#FFFFFF')};
`

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 20px;
  flex: 1;
  background-color: #36314e;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const IconContainer = styled.div`
  height: 125px;
  width: 125px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #322d43;
  margin-right: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const InfoMainContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const InfoTitle = styled.span`
  font-size: 16px;
  margin-bottom: 5px;
`

const InfoValueContainer = styled.div`
  display: flex;
  align-items: center;
`

const InfoValue = styled.span`
  font-size: 25px;
  margin-right: 10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 16px;
  `};
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

  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 12px;
  `};
`

const InfoRowContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 30px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
`

const ExploreLink = styled(Link)<{ fontSize?: string }>`
  cursor: pointer;
  position: relative; /* Add position relative to the parent element */
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background-color: #3b3855;
  padding: 0.625rem 1.25rem;
  gap: 0.625rem;
  border-radius: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(67.55deg, #2f3bae 4.5%, #9a81ff 95.77%);
    opacity: 0;
    border-radius: inherit;
    transition: opacity 0.3s ease; /* Add transition property for opacity */
  }

  :hover::before {
    opacity: 1; /* Change the opacity on hover to reveal the background gradient */
  }

  :focus {
    outline: none;
    text-decoration: none;
  }

  :active {
    text-decoration: none;
  }
`

const ExploreIconContainer = styled.div`
  z-index: 2;
  display: flex;
  align-items: center;
`

const LinkContent = styled.span`
  z-index: 2;
  color: white;
  font-weight: 500;
  font-size: 14px;
`

const PageSubHeader = styled.span`
  font-size: 30px;
  margin-top: 30px;

  @media (max-width: 1080px) {
    margin-top: 100px;
    font-size: 24px;
  }
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

const DailyInfoElement: React.FC<DailyInfoElementProps> = ({ title, icon, value, percentageChange }: any) => {
  const truncated = parseFloat(percentageChange?.toFixed(2))

  return (
    <ContentContainer>
      <IconContainer>
        <img width="60px" height="60px" alt="icon" src={icon} />
      </IconContainer>
      <InfoMainContainer>
        <InfoTitle>{title}</InfoTitle>
        <InfoValueContainer>
          <InfoValue>{value}</InfoValue>
          <InfoValueChange isNegative={truncated < 0}>
            {truncated > 0 ? (
              <img width="17px" height="17px" alt="arrow" src={ArrowUpIcon} />
            ) : (
              <img width="17px" height="17px" alt="arrow" src={ArrowDownIcon} />
            )}
            <ChangeValue isNegative={truncated < 0}>{Math.abs(percentageChange).toFixed(2)}%</ChangeValue>
          </InfoValueChange>
        </InfoValueContainer>
      </InfoMainContainer>
    </ContentContainer>
  )
}

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const theme = useTheme()

  const [activeNetwork] = useActiveNetworkVersion()

  const [protocolData] = useProtocolData()
  const [transactions] = useProtocolTransactions()

  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()
  const [leftLabel, setLeftLabel] = useState<string | undefined>()
  const [rightLabel, setRightLabel] = useState<string | undefined>()

  // Hot fix to remove errors in TVL data while subgraph syncs.
  const [chartData] = useProtocolChartData()

  useEffect(() => {
    setLiquidityHover(undefined)
    setVolumeHover(undefined)
  }, [activeNetwork])

  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((p) => p.data)
      .filter(notEmpty)
  }, [allPoolData])

  // if hover value undefined, reset to current day value
  useEffect(() => {
    if (volumeHover === undefined && protocolData) {
      setVolumeHover(protocolData.volumeUSD)
    }
  }, [protocolData, volumeHover])
  useEffect(() => {
    if (liquidityHover === undefined && protocolData) {
      setLiquidityHover(protocolData.tvlUSD)
    }
  }, [liquidityHover, protocolData])

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.tvlUSD,
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

  const weeklyVolumeData = useTransformedVolumeData(chartData, 'week')
  const monthlyVolumeData = useTransformedVolumeData(chartData, 'month')

  const weeklyTVLData = useTransformedTVLData(chartData, 'week')
  const monthlyTVLData = useTransformedTVLData(chartData, 'month')

  const allTokens = useAllTokenData()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((t) => t.data)
      .filter(notEmpty)
  }, [allTokens])

  const [volumeWindow, setVolumeWindow] = useState(VolumeWindow.weekly)
  const [tvlWindow, setTvlWindow] = useState(VolumeWindow.weekly)

  const tvlValue = useMemo(() => {
    if (liquidityHover) {
      return formatDollarAmount(liquidityHover, 2, true)
    }
    return formatDollarAmount(protocolData?.tvlUSD, 2, true)
  }, [liquidityHover, protocolData?.tvlUSD])

  return (
    <PageWrapper>
      <ThemedBackgroundGlobal backgroundColor={activeNetwork.bgColor} />
      <AutoColumn gap="16px">
        <PageSubHeader>Analytics Overview</PageSubHeader>
        <ResponsiveRow>
          <ChartWrapper>
            <LineChart
              data={
                tvlWindow === VolumeWindow.monthly
                  ? monthlyTVLData
                  : tvlWindow === VolumeWindow.weekly
                  ? weeklyTVLData
                  : formattedTvlData
              }
              height={220}
              minHeight={332}
              value={liquidityHover}
              label={leftLabel}
              setValue={setLiquidityHover}
              setLabel={setLeftLabel}
              activeWindow={tvlWindow}
              topRight={
                <WindowSwitchContainer>
                  <SmallOptionButton onClick={() => setTvlWindow(VolumeWindow.daily)}>
                    <SwitchOption active={tvlWindow === VolumeWindow.daily}>D</SwitchOption>
                  </SmallOptionButton>
                  <SmallOptionButton style={{ marginLeft: '8px' }} onClick={() => setTvlWindow(VolumeWindow.weekly)}>
                    <SwitchOption active={tvlWindow === VolumeWindow.weekly}>W</SwitchOption>
                  </SmallOptionButton>
                  <SmallOptionButton style={{ marginLeft: '8px' }} onClick={() => setTvlWindow(VolumeWindow.monthly)}>
                    <SwitchOption active={tvlWindow === VolumeWindow.monthly}>M</SwitchOption>
                  </SmallOptionButton>
                </WindowSwitchContainer>
              }
              topLeft={
                <InfoWrapper>
                  <InfoContainer>
                    <LeftAlignContainer>
                      <ChartTitle>TVL</ChartTitle>
                      <ChartSubTitle>Total Value Locked</ChartSubTitle>
                    </LeftAlignContainer>
                  </InfoContainer>
                  <InfoSeparator />
                  <InfoContainer>
                    <LeftAlignContainer>
                      <ChartTitle>{tvlValue}</ChartTitle>
                      <TimeVolumeContainer>
                        <img width={'20px'} height={'20px'} src={CalendarIcon} alt="Calendar" />
                        <ChartSubTitle>{leftLabel ? <MonoSpace>{leftLabel}</MonoSpace> : 'All time'}</ChartSubTitle>
                      </TimeVolumeContainer>
                    </LeftAlignContainer>
                  </InfoContainer>
                </InfoWrapper>
              }
            />
          </ChartWrapper>
          <ChartWrapper>
            <BarChart
              height={220}
              minHeight={332}
              data={
                volumeWindow === VolumeWindow.monthly
                  ? monthlyVolumeData
                  : volumeWindow === VolumeWindow.weekly
                  ? weeklyVolumeData
                  : formattedVolumeData
              }
              color="yellow"
              setValue={setVolumeHover}
              setLabel={setRightLabel}
              value={volumeHover}
              label={rightLabel}
              activeWindow={volumeWindow}
              topRight={
                <WindowSwitchContainer>
                  <SmallOptionButton onClick={() => setVolumeWindow(VolumeWindow.daily)}>
                    <SwitchOption active={volumeWindow === VolumeWindow.daily}>D</SwitchOption>
                  </SmallOptionButton>
                  <SmallOptionButton style={{ marginLeft: '8px' }} onClick={() => setVolumeWindow(VolumeWindow.weekly)}>
                    <SwitchOption active={volumeWindow === VolumeWindow.weekly}>W</SwitchOption>
                  </SmallOptionButton>
                  <SmallOptionButton
                    style={{ marginLeft: '8px' }}
                    onClick={() => setVolumeWindow(VolumeWindow.monthly)}
                  >
                    <SwitchOption active={volumeWindow === VolumeWindow.monthly}>M</SwitchOption>
                  </SmallOptionButton>
                </WindowSwitchContainer>
              }
              topLeft={
                <InfoWrapper>
                  <InfoContainer>
                    <LeftAlignContainer>
                      <ChartTitle>Volume</ChartTitle>
                      <TYPE.subHeader fontSize="12px">24h Volume</TYPE.subHeader>
                    </LeftAlignContainer>
                  </InfoContainer>
                  <InfoSeparator />
                  <InfoContainer>
                    <LeftAlignContainer>
                      <ChartTitle>{formatDollarAmount(volumeHover, 2)}</ChartTitle>
                      <TimeVolumeContainer>
                        <img width={'20px'} height={'20px'} src={CalendarIcon} alt="Calendar" />
                        <ChartSubTitle>{rightLabel ? <MonoSpace>{rightLabel}</MonoSpace> : 'All time'}</ChartSubTitle>
                      </TimeVolumeContainer>
                    </LeftAlignContainer>
                  </InfoContainer>
                </InfoWrapper>
              }
            />
          </ChartWrapper>
        </ResponsiveRow>
        <InfoRowContainer>
          <DailyInfoElement
            title="24hs Volume"
            value={formatDollarAmount(protocolData?.volumeUSD)}
            percentageChange={protocolData?.volumeUSDChange}
            icon={EqualizerIcon}
          />
          <DailyInfoElement
            title="24hs Fees"
            value={formatDollarAmount(protocolData?.feesUSD)}
            percentageChange={protocolData?.feeChange}
            icon={InsightsIcon}
          />
          <DailyInfoElement
            title="Total Value Locked"
            value={formatDollarAmount(protocolData?.tvlUSD)}
            percentageChange={protocolData?.tvlUSDChange}
            icon={LockIcon}
          />
        </InfoRowContainer>

        <TableRowBetween>
          <TYPE.subHeader fontSize="30px">Tokens</TYPE.subHeader>
          <ExploreLink to="tokens">
            <LinkContent>Explore</LinkContent>
            <ExploreIconContainer>
              <img height={20} width={20} alt="arrow" src={ArrowRightIcon} />
            </ExploreIconContainer>
          </ExploreLink>
        </TableRowBetween>
        <TokenTable tokenDatas={formattedTokens} />
        <TableRowBetween>
          <TYPE.subHeader fontSize="30px">Pools</TYPE.subHeader>
          <ExploreLink to="pools">
            <LinkContent>Explore</LinkContent>
            <ExploreIconContainer>
              <img height={20} width={20} alt="arrow" src={ArrowRightIcon} />
            </ExploreIconContainer>
          </ExploreLink>
        </TableRowBetween>
        <PoolTable poolDatas={poolDatas} />
        <TableRowBetween>
          <TYPE.subHeader fontSize="30px">Transactions</TYPE.subHeader>
        </TableRowBetween>
        {transactions ? <TransactionsTable transactions={transactions} color={activeNetwork.primaryColor} /> : null}
      </AutoColumn>
    </PageWrapper>
  )
}
