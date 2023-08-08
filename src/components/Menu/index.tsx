import React, { useRef } from 'react'
import { BookOpen, Code, Info, MessageCircle } from 'react-feather'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import MenuIcon from '../../assets/svg/menu.svg'

import { ExternalLink } from '../../theme'

const StyledMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  min-width: 55px;
  border-radius: 15px;
  background: #2b263e;
  border: none;

  @media (max-width: 1080px) {
    height: 48px;
    min-width: 48px;
  }

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background: linear-gradient(67.55deg, #3f4ab3 4.5%, #7a64d0 95.77%);
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: #302b41;
  backdrop-filter: blur(20px);
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  right: 0rem;
  bottom: 0;
  z-index: 100;
  transform: translateY(100%);
  gap: 8px;
`

const MenuItem = styled(ExternalLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  background: #3b3852;
  :hover {
    background: linear-gradient(67.55deg, #3f4ab3 4.5%, #7a64d0 95.77%);
    cursor: pointer;
    text-decoration: none;
  }
`

const CODE_LINK = 'https://github.com/Uniswap/uniswap-v3-info'

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <img height="14px" width="14px" alt="menu" src={MenuIcon} />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <MenuItem id="link" href="https://app.chronos.exchange/">
            Chronos Dex
          </MenuItem>
          <MenuItem id="link" href="https://marketplace.chronos.exchange/">
            Marketplace
          </MenuItem>
          <MenuItem id="link" href="/">
            Perpetuals
          </MenuItem>
          <MenuItem id="link" href="https://medium.com/@chronosarbitrum">
            About
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
