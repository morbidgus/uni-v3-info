import React, { useMemo, useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAllTokenData } from 'state/tokens/hooks'
import { GreyCard } from 'components/Card'
import { TokenData } from 'state/tokens/reducer'
import { AutoColumn } from 'components/Column'
import { RowFixed, RowFlat } from 'components/Row'
import CurrencyLogo from 'components/CurrencyLogo'
import { TYPE, StyledInternalLink } from 'theme'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import HoverInlineText from 'components/HoverInlineText'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import ArrowDownIcon from '../../assets/svg/arrow-down.svg'

const CardWrapper = styled(StyledInternalLink)`
  margin-right: 16px;

  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const FixedContainer = styled(AutoColumn)``

export const ScrollableRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;

  ::-webkit-scrollbar {
    display: none;
  }
`

const ReversedScrollableRow = styled(ScrollableRow)``

const SymbolContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  width: fit-content;
  background: #3b3855;
  border-radius: 20px;
  padding: 2px 10px;
`

const TokenContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const InfoValueChange = styled.div<{ isNegative?: boolean }>`
  display: flex;
  align-items: center;
  border: 1px solid ${({ isNegative }) => (isNegative ? '#FF2A5F' : '#27F291')}
  border-radius: 20px;
  padding: 2px 10px;
`

const ChangeValue = styled.span<{ isNegative?: boolean }>`
  color: ${({ isNegative }) => (isNegative ? '#FF2A5F' : '#27F291')};
  font-size: 10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 8px;
  `};
`

const TokenValue = styled.span``

const DataCard = ({ tokenData }: { tokenData: TokenData }) => {
  const truncated = parseFloat(tokenData.priceUSDChange?.toFixed(2))
  return (
    <CardWrapper to={'tokens/' + tokenData.address}>
      <GreyCard padding="11px">
        <RowFixed>
          <CurrencyLogo address={tokenData.address} size="40px" />
          <AutoColumn gap="10px" style={{ marginLeft: '12px' }}>
            <TokenContainer>
              <TYPE.label fontSize="10px">
                <HoverInlineText text={tokenData.name} maxCharacters={10} />
              </TYPE.label>
              <SymbolContainer>{tokenData.symbol}</SymbolContainer>
            </TokenContainer>

            <TokenContainer>
              <TokenValue>{formatDollarAmount(tokenData.priceUSD)}</TokenValue>
              <InfoValueChange isNegative={truncated < 0}>
                {truncated > 0 ? (
                  <img width="17px" height="17px" alt="arrow" src={ArrowUpIcon} />
                ) : (
                  <img width="17px" height="17px" alt="arrow" src={ArrowDownIcon} />
                )}

                <ChangeValue isNegative={truncated < 0}>{Math.abs(tokenData.priceUSDChange).toFixed(2)}%</ChangeValue>
              </InfoValueChange>
            </TokenContainer>
          </AutoColumn>
        </RowFixed>
      </GreyCard>
    </CardWrapper>
  )
}

export default function TopTokenMovers() {
  const allTokens = useAllTokenData()

  const topPriceIncrease = useMemo(() => {
    return Object.values(allTokens).sort(({ data: a }, { data: b }) => {
      return a && b ? (Math.abs(a?.priceUSDChange) > Math.abs(b?.priceUSDChange) ? -1 : 1) : -1
    })
  }, [allTokens])

  const middleIndex = Math.floor(topPriceIncrease.length / 2)
  const firstHalf = topPriceIncrease.slice(0, middleIndex)
  const secondHalf = topPriceIncrease.slice(middleIndex)

  const increaseRef = useRef<HTMLDivElement>(null)
  const decreaseRef = useRef<HTMLDivElement>(null)
  const [increaseSet, setIncreaseSet] = useState(false)
  const [decreaseSet, setDecreaseSet] = useState(false)
  // const [pauseAnimation, setPauseAnimation] = useState(false)
  // const [resetInterval, setClearInterval] = useState<() => void | undefined>()

  useEffect(() => {
    if (!increaseSet && increaseRef && increaseRef.current) {
      setInterval(() => {
        if (increaseRef.current && increaseRef.current.scrollLeft !== increaseRef.current.scrollWidth) {
          increaseRef.current.scrollTo(increaseRef.current.scrollLeft + 1, 0)
        }
      }, 30)
      setIncreaseSet(true)
    }
  }, [increaseRef, increaseSet])

  useEffect(() => {
    if (!decreaseSet && decreaseRef && decreaseRef.current) {
      const maxScroll = decreaseRef.current.scrollWidth - decreaseRef.current.clientWidth
      decreaseRef.current.scrollTo(maxScroll, 0)

      let scrollPosition = maxScroll
      const scrollInterval = setInterval(() => {
        if (decreaseRef.current && scrollPosition >= 0) {
          decreaseRef.current.scrollTo(scrollPosition, 0)
          scrollPosition -= 1
        } else {
          clearInterval(scrollInterval)
        }
      }, 30)

      setDecreaseSet(true)
    }
  }, [decreaseRef, decreaseSet])

  // function handleHover() {
  //   if (resetInterval) {
  //     resetInterval()
  //   }
  //   setPauseAnimation(true)
  // }

  return (
    <FixedContainer gap="md">
      <ScrollableRow ref={increaseRef}>
        {firstHalf.map((entry) =>
          entry.data ? <DataCard key={'top-card-token-' + entry.data?.address} tokenData={entry.data} /> : null
        )}
      </ScrollableRow>

      <ReversedScrollableRow ref={decreaseRef}>
        {secondHalf.map((entry) =>
          entry.data ? <DataCard key={'top-card-token-' + entry.data?.address} tokenData={entry.data} /> : null
        )}
      </ReversedScrollableRow>
    </FixedContainer>
  )
}
