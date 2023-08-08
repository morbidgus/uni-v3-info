import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import styled from 'styled-components'
import LogoDark from '../../assets/svg/logo_white.svg'
import ChronosLogo from '../../assets/svg/chronos-logo.svg'
import ChronosHourglass from '../../assets/svg/hourglass.svg'
import MenuIcon from '../../assets/svg/menu.svg'
import Menu from '../Menu'
import Row, { RowFixed, RowBetween, SearchRow } from '../Row'
import SearchSmall from 'components/Search'
import NetworkDropdown from 'components/Menu/NetworkDropdown'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { networkPrefix } from 'utils/networkPrefix'
import { AutoColumn } from 'components/Column'

const HeaderFrame = styled.div<{ notAtTop?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  backdrop-filter: blur(20px);
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 1rem;
  z-index: 2;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    padding: 0.5rem 1rem;
    width: calc(100%);
    position: relative;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.5rem 1rem;
  `}
  ${({ notAtTop }) => notAtTop && 'border-bottom: 1px solid rgba(255,255,255,0.2)'}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  @media (max-width: 1080px) {
    display: none;
  }
`

const HeaderRow = styled(RowFixed)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  width: 100%;
  @media (max-width: 1080px) {
    width: 100%;
    display: none;
  }
`

const HeaderOptions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
  @media (max-width: 1080px) {
    padding: 0.5rem;
    justify-content: flex-end;
  } ;
`

const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-end
  margin-right: 2rem;
  margin-left: 2rem;
  :hover {
    cursor: pointer;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
`

const UniIcon = styled.div``

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 12px;
  width: fit-content;
  margin: 0 6px;
  padding: 8px 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 20px;
    background: linear-gradient(67.55deg, #3f4ab3 4.5%, #7a64d0 95.77%);
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const SmallContentGrouping = styled.div`
  width: 100%;
  display: none;
  @media (max-width: 1080px) {
    display: initial;
  }
`

const MenuButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  min-width: 55px;
  border-radius: 15px;
  background: #2b263e;

  @media (max-width: 1080px) {
    height: 48px;
    min-width: 48px;
  }
`

export default function Header() {
  const [activeNewtork] = useActiveNetworkVersion()
  const [notAtTop, setNotAtTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setNotAtTop(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <HeaderFrame notAtTop={notAtTop}>
      <HeaderRow>
        <Title to={networkPrefix(activeNewtork)}>
          <UniIcon>
            <img width={'240px'} height={'50px'} src={ChronosLogo} alt="logo" />
          </UniIcon>
        </Title>
        <SearchSmall />
        <HeaderOptions>
          <StyledNavLink
            id={`pool-nav-link`}
            to={networkPrefix(activeNewtork)}
            isActive={(match, { pathname }) => pathname === '/'}
          >
            Overview
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={networkPrefix(activeNewtork) + 'pools'}>
            Pools
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={networkPrefix(activeNewtork) + 'tokens'}>
            Tokens
          </StyledNavLink>
        </HeaderOptions>
        <Menu />
      </HeaderRow>
      <SmallContentGrouping>
        <AutoColumn gap="sm">
          {/* <NetworkDropdown /> */}
          <RowBetween>
            <img width={'150px'} height={'50px'} src={ChronosHourglass} alt="logo" />
            <HeaderOptions>
              <StyledNavLink
                id={`pool-nav-link`}
                to={networkPrefix(activeNewtork)}
                isActive={(match, { pathname }) => pathname === '/'}
              >
                Overview
              </StyledNavLink>
              <StyledNavLink id={`stake-nav-link`} to={networkPrefix(activeNewtork) + 'pools'}>
                Pools
              </StyledNavLink>
              <StyledNavLink id={`stake-nav-link`} to={networkPrefix(activeNewtork) + 'tokens'}>
                Tokens
              </StyledNavLink>
            </HeaderOptions>
          </RowBetween>
          <SearchRow>
            <SearchSmall />
            <Menu />
          </SearchRow>
        </AutoColumn>
      </SmallContentGrouping>
    </HeaderFrame>
  )
}
