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
    bscTestnet:{
      url:"https://data-seed-prebsc-1-s1.binance.org:8545",
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
    },
    polygonZkEvmTestnet:{
      url:"https://rpc.public.zkevm-test.net",
      accounts: accountConfig
    }
  },
  solidity:{

      
        version:"0.8.20",
        settings: {
          optimizer:{
            enabled:true,
            runs:200
          }
      }
      
  }
};
