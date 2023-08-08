import React, { useCallback, useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { DarkGreyCard } from 'components/Card'
import Loader from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { formatDollarAmount, formatAmount } from 'utils/numbers'
import { shortenAddress, getEtherscanLink } from 'utils'
import { Label, ClickableText } from 'components/Text'
import { Transaction, TransactionType } from 'types'
import { formatTime } from 'utils/date'
import { RowFixed } from 'components/Row'
import { ExternalLink, TYPE } from 'theme'
import { PageButtons, Arrow, Break } from 'components/shared'
import useTheme from 'hooks/useTheme'
import HoverInlineText from 'components/HoverInlineText'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { OptimismNetworkInfo } from 'constants/networks'
import GradientSquare from '../../assets/svg/gradient-square.svg'

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
  padding: 0;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  padding: 16px 1rem;

  grid-template-columns: 1.5fr repeat(5, 1fr);

  @media screen and (max-width: 940px) {
    grid-template-columns: 1.5fr repeat(4, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 1.5fr repeat(2, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 1.5fr repeat(1, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(2) {
      display: none;
    }
  }
`

const LinkWrapper = styled.div`
  cursor: pointer;
  :hover {
    background: #36314e;
  }
`

const SortText = styled.div<{ active?: boolean }>`
  display: flex;
  padding: 0.625rem 1.25rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 20px;
  font-weight: 400;
  background: ${({ active }) => (active ? 'linear-gradient(67.55deg, #3f4ab3 4.5%, #7a64d0 95.77%)' : '#2b2940')};
  font-size: 12px;
  color: white;
  margin-right: 10px;

  :hover {
    background: linear-gradient(67.55deg, #3f4ab3 4.5%, #7a64d0 95.77%);
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const TransactionLabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 0.625rem 0.9375rem;
  gap: 5px;
`

const TransactionLabel = styled.span`
  font-size: 14px;
  background: linear-gradient(67.55deg, #3f4ab3 4.5%, #7a64d0 95.77%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  ${({ theme }) => theme.mediaWidth.upToSmall`
font-size: 10px;
`};
`

const SORT_FIELD = {
  amountUSD: 'amountUSD',
  timestamp: 'timestamp',
  sender: 'sender',
  amountToken0: 'amountToken0',
  amountToken1: 'amountToken1',
}

const DataRow = ({ transaction, color }: { transaction: Transaction; color?: string }) => {
  const abs0 = Math.abs(transaction.amountToken0)
  const abs1 = Math.abs(transaction.amountToken1)
  const outputTokenSymbol = transaction.amountToken0 < 0 ? transaction.token0Symbol : transaction.token1Symbol
  const inputTokenSymbol = transaction.amountToken1 < 0 ? transaction.token0Symbol : transaction.token1Symbol
  const [activeNetwork] = useActiveNetworkVersion()
  const theme = useTheme()

  return (
    <LinkWrapper>
      <ResponsiveGrid>
        <ExternalLink href={getEtherscanLink(1, transaction.hash, 'transaction', activeNetwork)}>
          <TransactionLabelContainer>
            <img height="18px" width="18px" alt="square-icon" src={GradientSquare} />
            <TransactionLabel>
              {transaction.type === TransactionType.MINT
                ? `Add ${transaction.token0Symbol} and ${transaction.token1Symbol}`
                : transaction.type === TransactionType.SWAP
                ? `Swap ${inputTokenSymbol} for ${outputTokenSymbol}`
                : `Remove ${transaction.token0Symbol} and ${transaction.token1Symbol}`}
            </TransactionLabel>
          </TransactionLabelContainer>
        </ExternalLink>
        <Label end={1} fontWeight={400}>
          {formatDollarAmount(transaction.amountUSD)}
        </Label>
        <Label end={1} fontWeight={400}>
          <HoverInlineText text={`${formatAmount(abs0)}  ${transaction.token0Symbol}`} maxCharacters={16} />
        </Label>
        <Label end={1} fontWeight={400}>
          <HoverInlineText text={`${formatAmount(abs1)}  ${transaction.token1Symbol}`} maxCharacters={16} />
        </Label>
        <Label end={1} fontWeight={400}>
          <ExternalLink
            href={getEtherscanLink(1, transaction.sender, 'address', activeNetwork)}
            style={{ color: color ?? theme.blue1 }}
          >
            <TransactionLabel>{shortenAddress(transaction.sender)}</TransactionLabel>
          </ExternalLink>
        </Label>
        <Label end={1} fontWeight={400}>
          {formatTime(transaction.timestamp, activeNetwork === OptimismNetworkInfo ? 8 : 0)}
        </Label>
      </ResponsiveGrid>
    </LinkWrapper>
  )
}

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

export default function TransactionTable({
  transactions,
  maxItems = 10,
  color,
}: {
  transactions: Transaction[]
  maxItems?: number
  color?: string
}) {
  // theming
  const theme = useTheme()

  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    let extraPages = 1
    if (transactions.length % maxItems === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(transactions.length / maxItems) + extraPages)
  }, [maxItems, transactions])

  // filter on txn type
  const [txFilter, setTxFilter] = useState<TransactionType | undefined>(undefined)

  const sortedTransactions = useMemo(() => {
    return transactions
      ? transactions
          .slice()
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof Transaction] > b[sortField as keyof Transaction]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1
            } else {
              return -1
            }
          })
          .filter((x) => {
            return txFilter === undefined || x.type === txFilter
          })
          .slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [transactions, maxItems, page, sortField, sortDirection, txFilter])

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

  if (!transactions) {
    return <Loader />
  }

  return (
    <Wrapper>
      <AutoColumn>
        <ResponsiveGrid>
          <RowFixed>
            <SortText
              onClick={() => {
                setTxFilter(undefined)
              }}
              active={txFilter === undefined}
            >
              All
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TransactionType.SWAP)
              }}
              active={txFilter === TransactionType.SWAP}
            >
              Swaps
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TransactionType.MINT)
              }}
              active={txFilter === TransactionType.MINT}
            >
              Adds
            </SortText>
            <SortText
              onClick={() => {
                setTxFilter(TransactionType.BURN)
              }}
              active={txFilter === TransactionType.BURN}
            >
              Removes
            </SortText>
          </RowFixed>
          <ClickableText color={theme.text2} onClick={() => handleSort(SORT_FIELD.amountUSD)} end={1}>
            Total Value {arrow(SORT_FIELD.amountUSD)}
          </ClickableText>
          <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.amountToken0)}>
            Token Amount {arrow(SORT_FIELD.amountToken0)}
          </ClickableText>
          <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.amountToken1)}>
            Token Amount {arrow(SORT_FIELD.amountToken1)}
          </ClickableText>
          <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.sender)}>
            Account {arrow(SORT_FIELD.sender)}
          </ClickableText>
          <ClickableText color={theme.text2} end={1} onClick={() => handleSort(SORT_FIELD.timestamp)}>
            Time {arrow(SORT_FIELD.timestamp)}
          </ClickableText>
        </ResponsiveGrid>
        <Break />

        {sortedTransactions.map((t, i) => {
          if (t) {
            return (
              <React.Fragment key={i}>
                <DataRow transaction={t} color={color} />
                <Break />
              </React.Fragment>
            )
          }
          return null
        })}
        {sortedTransactions.length === 0 ? <TYPE.main>No Transactions</TYPE.main> : undefined}
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
    </Wrapper>
  )
}
