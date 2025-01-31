import styled from 'styled-components'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{ width?: string; padding?: string; border?: string; borderRadius?: string }>`
  width: ${({ width }) => width ?? '100%'};
  border-radius: 16px;
  padding: 1rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

export const LightGreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg3};
`

export const GreyCard = styled(Card)<{ noBorder?: boolean }>`
  background: ${({ theme }) => theme.gd2};
  border: ${({ noBorder }) => (noBorder ? 'none' : '1px solid rgba(255, 255, 255, 0.1)')};
  backdrop-filter: blur(7.5px);
`
export const ChartCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.border1};
  backdrop-filter: blur(20px);
`

export const DarkGreyCard = styled(Card)``

export const DarkBlackCard = styled(Card)`
  background: rgba(29, 27, 38, 0.2);
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg3};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow3};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`

export const BlueCard = styled(Card)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.blue2};
  border-radius: 12px;
  width: fit-content;
`

export const ScrollableX = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const GreyBadge = styled(Card)`
  width: fit-content;
  border-radius: 20px;
  background: linear-gradient(67.55deg, #3f4ab3 4.5%, #7a64d0 95.77%);
  color: ${({ theme }) => theme.text1};
  padding: 0.125rem 0.625rem;
  font-weight: 400;
  font-size: 11px;
`
