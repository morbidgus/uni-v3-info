import styled from 'styled-components'
import { TYPE } from 'theme'

// responsive text
export const Label = styled(TYPE.label)<{ end?: number; isGreen?: boolean }>`
  display: flex;
  font-size: 14px;
  font-weight: 400;
  justify-content: ${({ end }) => (end ? 'flex-end' : 'flex-start')};
  align-items: center;
  font-variant-numeric: tabular-nums;
  color: ${({ isGreen }) => (isGreen ? '#27F291' : 'white')};
  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`

export const ClickableText = styled(Label)`
  text-align: end;
  font-size: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  @media screen and (max-width: 640px) {
    font-size: 12px;
  }
`
