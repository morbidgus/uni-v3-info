import React, { useCallback, useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { TYPE } from 'theme'
import { DarkGreyCard, GreyBadge } from 'components/Card'
import Loader, { LoadingRows } from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { RowFixed } from 'components/Row'
import { formatDollarAmount } from 'utils/numbers'
import { PoolData } from 'state/pools/reducer'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { feeTierPercent } from 'utils'
import { Label, ClickableText } from 'components/Text'
import { PageButtons, Arrow, Break } from 'components/shared'
import { POOL_HIDE } from '../../constants/index'
import useTheme from 'hooks/useTheme'
import { networkPrefix } from 'utils/networkPrefix'
import { useActiveNetworkVersion } from 'state/application/hooks'

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
  padding: 0;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  padding: 16px 1rem;

  grid-template-columns: 20px 3.5fr repeat(3, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(2, 1fr);
    & :nth-child(3) {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(1, 1fr);
    & :nth-child(5) {
      display: none;
    }
  }

  @media screen and (max-width: 480px) {
    grid-template-columns: 2.5fr repeat(1, 1fr);
    > *:nth-child(1) {
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

const SORT_FIELD = {
  feeTier: 'feeTier',
  volumeUSD: 'volumeUSD',
  tvlUSD: 'tvlUSD',
  volumeUSDWeek: 'volumeUSDWeek',
}

const DataRow = ({ poolData, index }: { poolData: PoolData; index: number }) => {
  const [activeNetwork] = useActiveNetworkVersion()

  const formattedIndex = (index + 1).toString().padStart(2, '0')

  return (
    <LinkWrapper to={networkPrefix(activeNetwork) + 'pools/' + poolData.address}>
      <ResponsiveGrid>
        <Label fontWeight={400}>{formattedIndex}</Label>
        <Label fontWeight={400}>
          <RowFixed>
            <DoubleCurrencyLogo
              address0={poolData.token0.address}
              address1={poolData.token1.address}
              size={36}
              margin
            />
            <TYPE.label ml="8px">
              {poolData.token0.symbol}/{poolData.token1.symbol}
            </TYPE.label>
            <GreyBadge ml="5px" fontSize="14px">
              +{feeTierPercent(poolData.feeTier)}
            </GreyBadge>
          </RowFixed>
        </Label>
        <Label end={1} fontWeight={400}>
          {formatDollarAmount(poolData.tvlUSD)}
        </Label>
        <Label end={1} fontWeight={400}>
          {formatDollarAmount(poolData.volumeUSD)}
        </Label>
        <Label end={1} fontWeight={400}>
          {formatDollarAmount(poolData.volumeUSDWeek)}
        </Label>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

const MAX_ITEMS = 10

export default function GaugesTable({ poolDatas, maxItems = MAX_ITEMS }: { poolDatas: PoolData[]; maxItems?: number }) {
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
    if (poolDatas.length % maxItems === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(poolDatas.length / maxItems) + extraPages)
  }, [maxItems, poolDatas])

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
          .filter((x) => !!x && !POOL_HIDE[currentNetwork.id].includes(x.address))
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            } else {
              return -1
            }
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [currentNetwork.id, maxItems, page, poolDatas, sortDirection, sortField])

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

  if (!poolDatas) {
    return <Loader />
  }

  return (
    <Wrapper>
      {sortedPools.length > 0 ? (
        <AutoColumn>
          <ResponsiveGrid>
            <Label color={theme.text2}>#</Label>
            <ClickableText color={theme.text2} onClick={() => handleSort(SORT_FIELD.feeTier)}>
              Name {arrow(SORT_FIELD.feeTier)}
            </ClickableText>
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.tvlUSD)}>
              APR {arrow(SORT_FIELD.tvlUSD)}
            </ClickableText>
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.volumeUSD)}>
              24H Volume {arrow(SORT_FIELD.volumeUSD)}
            </ClickableText>
            <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}>
              7d Volume {arrow(SORT_FIELD.volumeUSDWeek)}
            </ClickableText>
          </ResponsiveGrid>
          <Break />
          {sortedPools.map((poolData, i) => {
            if (poolData) {
              return (
                <React.Fragment key={i}>
                  <DataRow index={(page - 1) * MAX_ITEMS + i} poolData={poolData} />
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
