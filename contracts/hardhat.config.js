require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
const accountConfig = [process.env.PRIVATE_KEY]
module.exports = {
  networks: {
    //testnet
    baseGoerliTestnet:{
      url:"https://base-goerli.gateway.tenderly.co",
      accounts: accountConfig
    },
    scrollTestnet:{
      url:"https://scroll-public.scroll-testnet.quiknode.pro",
      accounts: accountConfig
    },
    zkSyncTestnet:{
      url:"https://testnet.era.zksync.dev",
      accounts: accountConfig
    },
    celoTestnet:{
      url:"https://alfajores-forno.celo-testnet.org",
      accounts: accountConfig
    },
    goerliTestnet:{
      url:"https://rpc.ankr.com/eth_goerli",
      accounts: accountConfig
    },
    sepoliaTestnet:{
      url:"https://eth-sepolia.public.blastapi.io",
      accounts: accountConfig
    },
    arbitrumTestnet:{
      url:"wss://arbitrum-goerli.publicnode.com",
      accounts: accountConfig
    },
    lineaTestnet:{
      url:"https://rpc.goerli.linea.build",
      accounts:accountConfig
    }
  },
  solidity:{
    versions: [
      {
        version:"0.8.20",
        optimizer:{
          enabled:true,
          runs:200
        }
      }
    ]
  }
};
