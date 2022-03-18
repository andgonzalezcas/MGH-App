import { Metaverse } from '../enums'
import { IAPIData } from '../types'
import { ellipseAddress } from '../utilities'
import { ICoinPrices, IPriceCard } from './valuationTypes'

export const convertETHPrediction = (
  coinPrices: ICoinPrices,
  ethPrediction: number,
  metaverse: Metaverse
) => {

  const ethUSD = coinPrices.ethereum.usd
  const usdPrediction = ethPrediction * ethUSD
  let metaverseUSD;
  let metaversePrediction;


  if (metaverse === Metaverse.SANDBOX) {
    metaverseUSD = coinPrices['the-sandbox'].usd
    metaversePrediction = usdPrediction / metaverseUSD
  } else if (metaverse === Metaverse.DECENTRALAND) {
    metaverseUSD = coinPrices['decentraland'].usd
    metaversePrediction = usdPrediction / metaverseUSD
  }
  else if (metaverse === Metaverse.AXIE_INFINITY) {
    metaverseUSD = coinPrices['axie-infinity'].usd
    metaversePrediction = usdPrediction / metaverseUSD
  }

  return { ethPrediction, usdPrediction, metaversePrediction }
}

export const convertMANAPrediction = (
  coinPrices: ICoinPrices,
  manaPrediction: number
) => {
  const ethUSD = coinPrices.ethereum.usd
  const manaUSD = coinPrices.decentraland.usd
  const usdPrediction = manaPrediction * manaUSD
  const ethPrediction = usdPrediction / ethUSD
  return { ethPrediction, usdPrediction, manaPrediction }
}

// Get Data for Single Land Asset
export const getLandData = async (
  metaverse: Metaverse,
  tokenID?: string,
  coordinates?: { X: string; Y: string }
) => {
  try {
    const predictionRes = await fetch('/api/getLandData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenID: tokenID,
        X: coordinates?.X,
        Y: coordinates?.Y,
        metaverse: metaverse,
      }),
    })
    const data = await predictionRes.json()
    return data
  } catch (e) {
    console.log(e)
  }
}

/* Formatting a Land Asset received from OpenSea into our Cards.
 The asset: any comes from the OpenSea API*/
export const formatLandAsset = async (
  assetId: any,
  coinPrices: ICoinPrices,
  metaverse: Metaverse
) => {
  const apiData: IAPIData = await getLandData(metaverse, assetId)
  const formattedAsset = {
    apiData: apiData,
    showCard: true,
    processing: false,
  }

  if (metaverse === 'sandbox') {
    Object.defineProperty(formattedAsset, 'predictions', {
      value: convertETHPrediction(coinPrices, apiData.prices!.predicted_price, Metaverse.SANDBOX),
    })
  } else if (metaverse === 'decentraland') {
    Object.defineProperty(formattedAsset, 'predictions', {
      value: convertMANAPrediction(coinPrices, apiData.prices!.predicted_price),
    })
  }
  return formattedAsset as IPriceCard
}

// Formatting Token Id if its too long
export const handleTokenID = (tokenID: string) => {
  if (tokenID.toString().length > 6) {
    return ellipseAddress(tokenID.toString(), 3)
  } else {
    return tokenID
  }
}

/**
 * @param listings Array of listing objects from each OpenSea Asset
 * @returns current price for asset
 */
export function getCurrentPrice(listings: any[] | undefined) {
  if (!listings || !listings[0]) return NaN
  const listing = listings[0]
  if (listing.payment_token_contract.symbol === 'USDC')
    return (
      (listing.current_price / 1e6) * listing.payment_token_contract.eth_price
    )
  if (listing.payment_token_contract.symbol === 'SAND')
    return (
      (listing.current_price / 1e18) *
      3 *
      listing.payment_token_contract.eth_price
    )
  return (
    (listing.current_price / 1e18) * listing.payment_token_contract.eth_price
  )
}

export const getAxieLandData = async (x: number, y: number) => {
  const res = await fetch('https://graphql-gateway.axieinfinity.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName: 'GetLandDetail',
      variables: {
        col: x,
        row: y,
      },
      query:
        'query GetLandDetail($col: Int!, $row: Int!) {\n  land(col: $col, row: $row) {\n    ...LandDetail\n    __typename\n  }\n}\n\nfragment LandDetail on LandPlot {\n  tokenId\n  owner\n  ownerProfile {\n    name\n    __typename\n  }\n  landType\n  row\n  col\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n',
    }),
  })
  const jsonRes = await res.json()
  return jsonRes.data.land
}
