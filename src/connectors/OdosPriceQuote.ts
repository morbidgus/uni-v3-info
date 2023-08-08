import { MAINNET_CHAIN_ID } from '../constants/Constants'
import { Address } from 'wagmi'

export async function quotePrice(tokenAddress: Address): Promise<number> {
  return new Promise((resolve, reject) => {
    fetch(`https://api.odos.xyz/pricing/token/${MAINNET_CHAIN_ID}/${tokenAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.detail) {
          reject(data.detail)
        } else {
          resolve(data.price)
        }
      })
      .catch((err) => {
        console.error(err)
        reject(err)
      })
  })
}
