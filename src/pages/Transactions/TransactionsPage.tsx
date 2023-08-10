import React, { useEffect } from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { TableRowBetween } from 'components/Row'
import useTheme from 'hooks/useTheme'
import { useProtocolTransactions } from 'state/protocol/hooks'
import { PageWrapper, ThemedBackgroundGlobal } from 'pages/styled'
import TransactionsTable from '../../components/TransactionsTable'
import { useActiveNetworkVersion } from 'state/application/hooks'

export default function TransactionsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const theme = useTheme()

  const [activeNetwork] = useActiveNetworkVersion()

  const [transactions] = useProtocolTransactions()

  return (
    <PageWrapper>
      <ThemedBackgroundGlobal backgroundColor={activeNetwork.bgColor} />
      <AutoColumn gap="16px">
        <TableRowBetween>
          <TYPE.subHeader fontSize="30px">Transactions</TYPE.subHeader>
        </TableRowBetween>
        {transactions ? <TransactionsTable transactions={transactions} color={activeNetwork.primaryColor} /> : null}
      </AutoColumn>
    </PageWrapper>
  )
}
