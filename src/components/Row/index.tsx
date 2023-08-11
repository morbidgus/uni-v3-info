import styled from 'styled-components'
import { Box } from 'rebass/styled-components'

const Row = styled(Box)<{
  width?: string
  align?: string
  justify?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  display: flex;
  padding: 0;
  align-items: ${({ align }) => align ?? 'flex-start'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`

export const RowBetween = styled(Row)<{ gradientBg?: string }>`
  justify-content: space-between;
  background: ${({ gradientBg }) => gradientBg && gradientBg};
  border-radius: 20px;
`

export const SearchRow = styled(Row)`
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`

export const TableRowBetween = styled(Row)`
  justify-content: space-between;
  margin-top: 2rem;
`

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`

export const RowFixed = styled(Row)<{ gap?: string; justify?: string; gradientBg?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
  align-items: center;
  background: ${({ gradientBg }) => gradientBg && gradientBg};
  gap: ${({ gap }) => gap && gap};
`

export const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    row-gap: 1rem;
  `};
`

export default Row
