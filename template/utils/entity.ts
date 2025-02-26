import { Address, Bytes, log } from '@graphprotocol/graph-ts'
import { Token } from '../generated/schema'
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol, fetchTokenTotalSupply } from './token'
import { ZERO_BD, ZERO_BI } from './constants'

export function getOrLoadToken(address: Bytes): Token {
  let tokenAddress = Address.fromBytes(address)
  let token = Token.load(tokenAddress)

  // fetch info if null
  if (!token) {
    token = new Token(tokenAddress)
    token.symbol = fetchTokenSymbol(tokenAddress)
    token.name = fetchTokenName(tokenAddress)
    token.totalSupply = fetchTokenTotalSupply(tokenAddress)
    let decimals = fetchTokenDecimals(tokenAddress)

    // bail if we couldn't figure out the decimals
    if (decimals.equals(ZERO_BI)) {
      log.debug('mybug the decimal on token was null', [tokenAddress.toHexString()])
    }

    token.decimals = decimals
    token.derivedETH = ZERO_BD
    token.derivedUSD = ZERO_BD
    token.volume = ZERO_BD
    token.volumeUSD = ZERO_BD
    token.feesUSD = ZERO_BD
    token.protocolFeesUSD = ZERO_BD
    token.untrackedVolumeUSD = ZERO_BD
    token.totalValueLocked = ZERO_BD
    token.totalValueLockedUSD = ZERO_BD
    token.totalValueLockedUSDUntracked = ZERO_BD
    token.txCount = ZERO_BI
    token.poolCount = ZERO_BI
    token.whitelistPools = []
  }

  return token
}
