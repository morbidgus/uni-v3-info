/* eslint-disable @typescript-eslint/camelcase */
import { AvailableTokenData, TokenData } from 'types'
import { createAPIRequest } from './APIRequest'

export function getAvailableTokens() {
  return new Promise<AvailableTokenData>((resolve, reject) => {
    createAPIRequest('/pairs/tokens')
      .get<{
        common_tokens: TokenData[]
        tokens: TokenData[]
        whitelisted_tokens: TokenData[]
      }>()
      .then((response) => {
        if (response.ok()) {
          const { common_tokens, tokens, whitelisted_tokens } = response.data
          resolve({
            commonTokens: common_tokens,
            tokens,
            whitelistedTokens: whitelisted_tokens,
            tokensDictionary: {
              ...tokens.reduce((acc, token) => ({ ...acc, [token.address.toLowerCase()]: token }), {}),
            },
          })
        }
      })
  })
}
