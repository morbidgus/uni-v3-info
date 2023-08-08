import React from 'react'
import styled from 'styled-components'

// assets
import LogoImg from '../../assets/svg/hourglass.svg'
import DiscordImg from '../../assets/svg/discord.svg'
import DexScreenerImg from '../../assets/svg/dexscreener.svg'
import GeckoTerminalImg from '../../assets/svg/gecko-terminal.svg'
import GitbookImg from '../../assets/svg/gitbook.svg'
import TwitterImg from '../../assets/svg/twitter.svg'
import TelegramImg from '../../assets/svg/telegram.svg'
import MediumImg from '../../assets/svg/medium.svg'

// personal models
interface SocialItem {
  name: string
  link: string
  img: any
}

const Socials: SocialItem[] = [
  {
    name: 'Dexcreener',
    link: 'https://dexscreener.com/arbitrum/0x20585bfbc272a9d58ad17582bcda9a5a57271d6a',
    img: DexScreenerImg,
  },
  {
    name: 'GeckoTerminal',
    link: 'https://www.geckoterminal.com/arbitrum/chronos/pools',
    img: GeckoTerminalImg,
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/ChronosFi_',
    img: TwitterImg,
  },
  {
    name: 'Discord',
    link: 'https://discord.com/invite/gTzrsdWgwD',
    img: DiscordImg,
  },
  {
    name: 'Telegram',
    link: 'https://t.me/chronosfinance',
    img: TelegramImg,
  },
  {
    name: 'Medium',
    link: 'https://medium.com/@chronosarbitrum',
    img: MediumImg,
  },
  {
    name: 'Gitbook',
    link: 'https://chronos-finance.gitbook.io/',
    img: GitbookImg,
  },
]

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
  padding-top: 38px;
  padding-bottom: 18px;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 0;
    padding: 12px 0;
  }
`

const StyledLogo = styled.img`
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`

const StyledTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (min-width: 640px) {
    align-items: flex-start;
  }
  
  p {
    font-size: 12px;zxdvzxv
    line-height: 15px;
  }
`

const StyledVersionBlock = styled.div`
  width: 120px;
  height: 24px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;sdfsdfgdg
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 16px;

  span {
    font-size: 10px;
    white-space: nowrap;
  }
`

const StyledSocialLink = styled.a`
  &.social {
    display: block;
  }
`

const StyledSocialButton = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 20px;
  padding: 0;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 640px) {
    width: 55px;
    height: 55px;
    border-radius: 20px;
  }
`

const StyledSocialImage = styled.img`
  width: 16px;
  height: 16px;

  @media (min-width: 640px) {
    width: 27px;
    height: 27px;
  }
`

const StyledFlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3;

  @media (min-width: 640px) {
    gap: 8;
  }
`

const StyledSocialFlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 640px) {
    gap: 4px;
  }
`

const AdaptiveWrapper = styled.div`
  max-width: 1280px;
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;

  @media (min-width: 640px) {
    padding-left: 32px;
    padding-right: 32px;
  }

  @media (min-width: 1280px) {
    padding-left: 0;
    padding-right: 0;
  }
`

const Footer: React.FC = () => {
  return (
    <AdaptiveWrapper>
      <StyledFooter>
        <StyledFlexRow>
          <StyledLogo alt="Chronos logo" src={LogoImg} />

          <StyledTextBlock>
            <p>Chronos © All rights reserved</p>
            <StyledVersionBlock>
              {/* <span>{process.env.COMMIT ? `Version: ${process.env.COMMIT}` : ''}</span> */}
              <span>Version: 98072290</span>
            </StyledVersionBlock>
          </StyledTextBlock>
        </StyledFlexRow>

        <StyledSocialFlexRow>
          {Socials.map((social) => (
            <StyledSocialLink className="social" target="_blank" href={social.link} key={social.name}>
              <StyledSocialButton>
                <StyledSocialImage src={social.img} alt={social.name} height={27} />
              </StyledSocialButton>
            </StyledSocialLink>
          ))}
        </StyledSocialFlexRow>
      </StyledFooter>
    </AdaptiveWrapper>
  )
}

export default Footer
