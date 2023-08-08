import React, { useState, useMemo, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { ExtraSmallOnly, HideExtraSmall, TYPE } from 'theme'
import { DarkGreyCard } from 'components/Card'
import { TokenData } from '../../state/tokens/reducer'
import Loader, { LoadingRows } from 'components/Loader'
import { Link } from 'react-router-dom'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { RowFixed } from 'components/Row'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { Label, ClickableText } from '../Text'
import { PageButtons, Arrow, Break } from 'components/shared'
import HoverInlineText from '../HoverInlineText'
import useTheme from 'hooks/useTheme'
import { TOKEN_HIDE } from '../../constants/index'
import { useActiveNetworkVersion } from 'state/application/hooks'
import CupIcon from '../../assets/svg/cup.svg'

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
  padding: 0;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  padding: 16px 1rem;

  grid-template-columns: 20px 3fr repeat(4, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 1.5fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: repeat(2, 1fr);
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
      display: none;
    }
  }
`

const LinkWrapper = styled(Link)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    background: #36314e;
  }
`

const ResponsiveLogo = styled(CurrencyLogo)`
  @media screen and (max-width: 670px) {
    width: 16px;
    height: 16px;
  }
`

const CoinLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`

const CoinSymbol = styled.div`
  background-color: #3b3855;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
`

const PaginationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
`

const PageNumberButtons = styled.div`
  display: flex;
  gap: 5px;
`

const PageButton = styled.button<{ active?: boolean }>`
  cursor: pointer;
  border: none;
  background-color: #2b2940;
  color: ${({ active, theme }) => (active ? theme.white : 'rgba(255, 255, 255, 0.3)')};
  padding: 6px 15px;
  border-radius: 100px;
  font-size: 15px;
  outline: none;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const PaginationEllipsis = styled.span`
  cursor: default;
  color: rgba(255, 255, 255, 0.3);
  border-radius: 100px;
  padding: 6px 15px;
  font-size: 15px;
  border: none;
  background-color: #2b2940;
`

const ChangeWindow = styled.span`
  color: #27f291;
  font-size: 14px;
  margin-right: 4px;
`

const DataRow = ({ tokenData, index }: { tokenData: TokenData; index: number }) => {
  const theme = useTheme()

  const formattedIndex = (index + 1).toString().padStart(2, '0')

  return (
    <LinkWrapper to={'tokens/' + tokenData.address}>
      <ResponsiveGrid>
        <Label>{formattedIndex}</Label>
        <Label>
          <RowFixed>
            <ResponsiveLogo address={tokenData.address} />
          </RowFixed>
          <ExtraSmallOnly style={{ marginLeft: '6px' }}>
            <Label ml="8px">{tokenData.symbol}</Label>
          </ExtraSmallOnly>
          <HideExtraSmall style={{ marginLeft: '10px' }}>
            <CoinLabel>
              <HoverInlineText text={tokenData.name} />
              <CoinSymbol>{tokenData.symbol}</CoinSymbol>
            </CoinLabel>
          </HideExtraSmall>
        </Label>
        <Label end={1} fontWeight={400} isGreen>
          {formatDollarAmount(tokenData.priceUSD)}
        </Label>
        <Label end={1} fontWeight={400}>
          <Percent value={tokenData.priceUSDChange} fontWeight={400} />
        </Label>
        <Label end={1} fontWeight={400}>
          {formatDollarAmount(tokenData.volumeUSD)}
        </Label>
        <Label end={1} fontWeight={400}>
          {formatDollarAmount(tokenData.tvlUSD)}
        </Label>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

const SORT_FIELD = {
  name: 'name',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  priceUSD: 'priceUSD',
  priceUSDChange: 'priceUSDChange',
  priceUSDChangeWeek: 'priceUSDChangeWeek',
}

const MAX_ITEMS = 10

export default function TokenTable({
  tokenDatas,
  maxItems = MAX_ITEMS,
}: {
  tokenDatas: TokenData[] | undefined
  maxItems?: number
}) {
  const [currentNetwork] = useActiveNetworkVersion()

  // theming
  const theme = useTheme()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.tvlUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (tokenDatas) {
      if (tokenDatas.length % maxItems === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(tokenDatas.length / maxItems) + extraPages)
    }
  }, [maxItems, tokenDatas])

  const sortedTokens = useMemo(() => {
    return tokenDatas
      ? tokenDatas
          .filter((x) => !!x && !TOKEN_HIDE[currentNetwork.id].includes(x.address))
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof TokenData] > b[sortField as keyof TokenData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            } else {
              return -1
            }
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [tokenDatas, maxItems, page, currentNetwork.id, sortField, sortDirection])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField]
  )

  const arrow = useCallback(
    (field: string) => {
      return sortField === field ? (!sortDirection ? '↑' : '↓') : ''
    },
    [sortDirection, sortField]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= maxPage) {
        setPage(newPage)
      }
    },
    [maxPage]
  )

  const pageNumbers = useMemo(() => {
    const arr = []
    for (let i = 1; i <= maxPage; i++) {
      arr.push(i)
    }
    return arr
  }, [maxPage])

  const isPrevDisabled = page === 1
  const isNextDisabled = page === maxPage

  if (!tokenDatas) {
    return <Loader />
  }

  return (
    <Wrapper>
      {sortedTokens.length > 0 ? (
        <AutoColumn>
          <ResponsiveGrid>
            <Label color={theme.text2}>
              <img height="19px" width="19px" alt="cup" src={CupIcon} />
            </Label>
            <ClickableText color={theme.text2} onClick={() => handleSort(SORT_FIELD.name)}>
              Name {arrow(SORT_FIELD.name)}
            </ClickableText>
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.priceUSD)}>
              Price {arrow(SORT_FIELD.priceUSD)}
            </ClickableText>
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.priceUSDChange)}>
              <ChangeWindow>24h / 7d</ChangeWindow>
              Change {arrow(SORT_FIELD.priceUSDChange)}
            </ClickableText>
            {/* <ClickableText end={1} onClick={() => handleSort(SORT_FIELD.priceUSDChangeWeek)}>
            7d {arrow(SORT_FIELD.priceUSDChangeWeek)}
          </ClickableText> */}
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
              24H Volume {arrow(SORT_FIELD.volumeUSD)}
            </ClickableText>
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
              Total Value Locked {arrow(SORT_FIELD.tvlUSD)}
            </ClickableText>
          </ResponsiveGrid>

          <Break />
          {sortedTokens.map((data, i) => {
            if (data) {
              return (
                <React.Fragment key={i}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} tokenData={data} />
                  <Break />
                </React.Fragment>
              )
            }
            return null
          })}
          <PaginationButtons>
            <PageButton onClick={() => handlePageChange(page - 1)} disabled={isPrevDisabled}>
              ←
            </PageButton>
            <PageNumberButtons>
              {pageNumbers.map((pageNumber, index) => {
                if (pageNumber === 1 || pageNumber === maxPage || (pageNumber >= page - 2 && pageNumber <= page + 2)) {
                  return (
                    <PageButton
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      active={pageNumber === page}
                    >
                      {pageNumber}
                    </PageButton>
                  )
                } else if (pageNumber === page - 5 || pageNumber === page + 5) {
                  return <PaginationEllipsis key={index}>...</PaginationEllipsis>
                }
                return null
              })}
            </PageNumberButtons>
            <PageButton onClick={() => handlePageChange(page + 1)} disabled={isNextDisabled}>
              →
            </PageButton>
          </PaginationButtons>
        </AutoColumn>
      ) : (
        <LoadingRows>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </LoadingRows>
      )}
    </Wrapper>
  )
}
