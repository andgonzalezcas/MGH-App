import { Interface } from 'ethers/lib/utils'

import stakingAbiMaticTestnet from '../backend/abi/stakingAbiMaticTestnet.json'
import tokenAbiMaticTestnet from '../backend/abi/tokenAbiMaticTestnet.json'
import stakingAbiMaticMainnet from '../backend/abi/stakingAbiMaticMainnet.json'
import tokenAbiMaticMainnet from '../backend/abi/tokenAbiMaticMainnet.json'

import tokenAbiETHRinkeby from '../backend/abi/tokenAbiETHRinkeby.json'
import stakingAbiETHRinkeby from '../backend/abi/stakingAbiETHRinkeby.json'
import tokenAbiETHMainnet from '../backend/abi/tokenAbiETHMainnet.json'
import IMetaverseStaking from '../backend/abi/IMetaverseStaking.json'
import SandToken from '../backend/abi/SandToken.json'

export const Contracts = {
  MGH_TOKEN: {
    MATIC_TESTNET: {
      address: '0xA26fcc9847F24C7D78f4e77Ba39A37B8A9eaFB02',
      abi: new Interface(tokenAbiMaticTestnet),
    },
    MATIC_MAINNET: {
      address: '0xc3C604F1943B8C619c5D65cd11A876e9C8eDCF10',
      abi: new Interface(tokenAbiMaticMainnet),
    },
    ETHEREUM_RINKEBY: {
      address: '0xe72bcCFCAbc7B62548d774D8F0208d1673454aC1',
      abi: new Interface(tokenAbiETHRinkeby),
    },
    ETHEREUM_MAINNET: {
      address: '0x8765b1a0eb57ca49be7eacd35b24a574d0203656',
      abi: new Interface(tokenAbiETHMainnet),
    },
  },
  MGH_STAKING: {
    MATIC_TESTNET: {
      address: '0x7d267713502F979ffE3c49622fd0DC24d6D607D0',
      abi: new Interface(stakingAbiMaticTestnet),
    },
    MATIC_MAINNET: {
      address: '0xb2Cc21271f2D3Ac2Aaaffa8Ed2F40fDe1C63d894',
      abi: new Interface(stakingAbiMaticMainnet),
    },
    ETHEREUM_RINKEBY: {
      address: '0x328475d10EC94310497F8796A990D3b04024ad82',
      abi: new Interface(stakingAbiETHRinkeby),
    },
    ETHEREUM_MAINNET: {
      address: '0x4b945f3fCbC1De8310D14d826DD5052e8f9375C2',
      abi: new Interface(stakingAbiETHRinkeby),
    },
  },
  MV_STAKING: {
    ETHEREUM_RINKEBY: {
      address: '0x9b7B8FFA98d857fB00724babE9FE7774db48c22D',
      abi: new Interface(IMetaverseStaking as unknown as string[]),
    },
  },
  SAND_TOKEN: {
    MOCK_RINKEBY: {
      address: '0x8D9284b81B862d78b456fb60D64f2C220e2089eB',
      interface: new Interface(SandToken),
    },
    ETHEREUM_MAINNET: {
      address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
      interface: new Interface(SandToken),
    },
  },
  // Sandbox
  LAND: {
    ETHEREUM_MAINNET: {
      oldAddress: '0x50f5474724e0Ee42D9a4e711ccFB275809Fd6d4a',
      newAddress: '0x5cc5b05a8a13e3fbdb0bb9fccd98d38e50f90c38',
    },
  },
  // Decentraland
  PARCEL: {
    ETHEREUM_MAINNET: {
      address: '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d',
    },
  },
}
