import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AutoRow, RowBetween, RowFixed } from 'components/Row'
import { ExternalLink, TYPE } from 'theme'
import { useEthPrices } from 'hooks/useEthPrices'
import { formatDollarAmount } from 'utils/numbers'
import Polling from './Polling'
import { useActiveNetworkVersion } from '../../state/application/hooks'
import { SupportedNetwork } from '../../constants/networks'
import EthereumIcon from '../../assets/svg/ethereum.svg'
import ChrLogo from '../../assets/svg/chronos-sm-white.svg'
import { quotePrice } from 'connectors/OdosPriceQuote'

const Wrapper = styled.div`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  padding: 10px 3rem;
`

const Item = styled(TYPE.main)`
  font-size: 12px;
`

const StyledLink = styled(ExternalLink)`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`

const TokenItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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
  gap: 10px;
`
const TopBarSeparator = styled.div`
  height: 30px;
  width: 1px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`

const TopBar = () => {
  const ethPrices = useEthPrices()
  const [activeNetwork] = useActiveNetworkVersion()
  const [chrPrice, setChrPrice] = useState(999)

  const getCurrencyPricing = async () => {
    const token = {
      name: 'CHR',
      symbol: 'CHR',
      decimals: 18,
      address: '0x15b2fb8f08e4ac1ce019eadae02ee92aedf06851',
      price_quote: 0.020685215202732237,
      is_low_liquidity: false,
    }

    if (token) {
      return quotePrice(token?.address as any)
    }

    return 0
  }

  useEffect(() => {
    const getPricing = async () => {
      setChrPrice(await getCurrencyPricing())
    }

    getPricing()
  }, [])

  return (
    <Wrapper>
      <RowContainer>
        <Polling />
        <TopBarElement>
          <TokenItem>
            <img height="20px" width="20px" alt="CHR" src={ChrLogo} />
            <Item fontWeight="700">{+chrPrice.toFixed(2)}$</Item>
          </TokenItem>

          <TopBarSeparator />

          <TokenItem>
            {activeNetwork.id === SupportedNetwork.CELO ? (
              <Item>Celo Price:</Item>
            ) : activeNetwork.id === SupportedNetwork.BNB ? (
              <Item>BNB Price:</Item>
            ) : activeNetwork.id === SupportedNetwork.AVALANCHE ? (
              <Item>AVAX Price:</Item>
            ) : (
              <img height="20px" width="12px" src={EthereumIcon} alt="Eth price" />
            )}
            <Item fontWeight="700">{formatDollarAmount(ethPrices?.current)}</Item>
          </TokenItem>
        </TopBarElement>
      </RowContainer>
    </Wrapper>
  )
}

export default TopBar
