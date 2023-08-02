import React from 'react'
import styled from 'styled-components'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { ExternalLink, TYPE } from 'theme'
import { useEthPrices } from 'hooks/useEthPrices'
import { formatDollarAmount } from 'utils/numbers'
import Polling from './Polling'
import { useActiveNetworkVersion } from '../../state/application/hooks'
import { SupportedNetwork } from '../../constants/networks'
import EthereumIcon from '../../assets/svg/ethereum.svg'

const Wrapper = styled.div`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px 3rem;
`

const Item = styled(TYPE.main)`
  font-size: 12px;
`

const StyledLink = styled(ExternalLink)`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`

const ETHItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
`

const TopBarElement = styled.div`
  display: flex;
  align-items: center;
`

const TopBar = () => {
  const ethPrices = useEthPrices()
  const [activeNetwork] = useActiveNetworkVersion()
  return (
    <Wrapper>
      <RowContainer>
        <Polling />
        <TopBarElement>
          {activeNetwork.id === SupportedNetwork.CELO ? (
            <Item>Celo Price:</Item>
          ) : activeNetwork.id === SupportedNetwork.BNB ? (
            <Item>BNB Price:</Item>
          ) : activeNetwork.id === SupportedNetwork.AVALANCHE ? (
            <Item>AVAX Price:</Item>
          ) : (
            <ETHItem>
              <img height="20px" width="12px" src={EthereumIcon} alt="Eth price" />
            </ETHItem>
          )}
          <Item fontWeight="700" ml="4px">
            {formatDollarAmount(ethPrices?.current)}
          </Item>
        </TopBarElement>
      </RowContainer>
    </Wrapper>
  )
}

export default TopBar
