import React, { Suspense, useState, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import Home from './Home'
import PoolsOverview from './Pool/PoolsOverview'
import TokensOverview from './Token/TokensOverview'
import TopBar from 'components/Header/TopBar'
import { RedirectInvalidToken } from './Token/redirects'
import { LocalLoader } from 'components/Loader'
import PoolPage from './Pool/PoolPage'
import { ExternalLink, TYPE } from 'theme'
import { useActiveNetworkVersion, useSubgraphStatus } from 'state/application/hooks'
import { DarkGreyCard } from 'components/Card'
import { SUPPORTED_NETWORK_VERSIONS, EthereumNetworkInfo, OptimismNetworkInfo } from 'constants/networks'
import Footer from 'components/Footer'
import TransactionsPage from './Transactions/TransactionsPage'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  overflow-x: hidden;
  min-height: 100vh;
  width: 100vw;

  /* Combine the background image and gradient as layers */
  background-image: url('https://i.ibb.co/44rv4vZ/Background.png'), linear-gradient(
    to bottom,
    rgba(24, 21, 34, 1) 0%,
    rgba(19, 17, 28, 1) 100% /* Set alpha to 0 at the bottom */
  );
  background-position: 0 0, 0 0;
  background-repeat: no-repeat, no-repeat;
  background-size: auto, 100%;
  background-attachment: scroll, fixed;
  background-origin: border-box, padding-box;
  background-clip: border-box, border-box;
}
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 100%;
  position: fixed;
  justify-content: space-between;
  z-index: 2;
`

const BodyWrapper = styled.div<{ warningActive?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 140px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  background: radial-gradient(80.62% 80.62% at 50% 19.38%, #2d283e 0.01%, rgba(26, 23, 40, 0.1) 100%);

  > * {
    max-width: 1200px;
  }

  @media (max-width: 1080px) {
    padding-top: 100px;
  }
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const Hide1080 = styled.div`
  @media (max-width: 1080px) {
    display: none;
  }
`

const WarningWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const WarningBanner = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  padding: 1rem;
  color: ${({ theme }) => theme.text1};
  font-size: 14px;
  width: 100%;
  text-align: center;
  font-weight: 500;
`

const BLOCK_DIFFERENCE_THRESHOLD = 30

export default function App() {
  // pretend load buffer
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setLoading(false), 1300)
  }, [])

  // update network based on route
  // TEMP - find better way to do this
  const location = useLocation()
  const [activeNetwork, setActiveNetwork] = useActiveNetworkVersion()
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveNetwork(EthereumNetworkInfo)
    } else {
      SUPPORTED_NETWORK_VERSIONS.map((n) => {
        if (location.pathname.includes(n.route.toLocaleLowerCase())) {
          setActiveNetwork(n)
        }
      })
    }
  }, [location.pathname, setActiveNetwork])

  // subgraph health
  const [subgraphStatus] = useSubgraphStatus()

  const showNotSyncedWarning =
    subgraphStatus.headBlock && subgraphStatus.syncedBlock && activeNetwork === OptimismNetworkInfo
      ? subgraphStatus.headBlock - subgraphStatus.syncedBlock > BLOCK_DIFFERENCE_THRESHOLD
      : false

  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      {loading ? (
        <LocalLoader fill={true} />
      ) : (
        <AppWrapper>
          <URLWarning />
          <HeaderWrapper>
            {showNotSyncedWarning && (
              <WarningWrapper>
                <WarningBanner>
                  {`Warning: 
                  Data has only synced to  block ${subgraphStatus.syncedBlock} (out of ${subgraphStatus.headBlock}). Please check back soon.`}
                </WarningBanner>
              </WarningWrapper>
            )}
            <Hide1080>
              <TopBar />
            </Hide1080>
            <Header />
          </HeaderWrapper>
          {subgraphStatus.available === false ? (
            <AppWrapper>
              <BodyWrapper>
                <DarkGreyCard style={{ maxWidth: '340px' }}>
                  <TYPE.label>
                    The Graph hosted network which provides data for this site is temporarily experiencing issues. Check
                    current status{' '}
                    <ExternalLink href="https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v3">
                      here.
                    </ExternalLink>
                  </TYPE.label>
                </DarkGreyCard>
              </BodyWrapper>
            </AppWrapper>
          ) : (
            <BodyWrapper warningActive={showNotSyncedWarning}>
              <Popups />
              <Switch>
                <Route exact strict path="/:networkID?/pools/:address" component={PoolPage} />
                <Route exact strict path="/:networkID?/pools" component={PoolsOverview} />
                <Route exact strict path="/:networkID?/tokens/:address" component={RedirectInvalidToken} />
                <Route exact strict path="/:networkID?/tokens" component={TokensOverview} />
                <Route exact strict path="/:networkID?/transactions" component={TransactionsPage} />
                <Route exact path="/:networkID?" component={Home} />
              </Switch>
              <Marginer />
            </BodyWrapper>
          )}
          <Footer />
        </AppWrapper>
      )}
    </Suspense>
  )
}
