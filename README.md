# ThreeFundMe


# Description

Introducing ThreeFundMe—an innovative on-chain application designed for seamless campaign creation, contribution, and communication. The platform boasts a user-friendly interface where you can explore and engage with various campaigns. Each campaign features a structured set of steps, comprising titles, descriptions, and fundraising goals. These steps detail the owner's objectives for utilizing the raised funds. Notably, the owner can only access the funds once a step's goal is met and the allotted time expires, prompting progression to the next phase. To keep contributors informed, owners can create multiple posts per step, providing a comprehensive timeline of their progress.


# How it's made

ThreeFundMe is the culmination of meticulous development, blending React for its dynamic frontend and Solidity to power the backend contracts. Our contract ecosystem comprises three integral components: the CompaignFactoryManager, housing comprehensive campaign data; the CompaignFactory, facilitating the creation of new campaigns; and the Compaign contract, the core logic governing each campaign's functionality.

Throughout our project journey, collaboration has been key. We've partnered with WalletConnect, ENS, and NounsDao to fortify our frontend UI and authentication capabilities. Leveraging Waku, we've integrated a robust chat system enabling seamless communication among contributors within each campaign. Moreover, the contribution will be made by using the utility token ApeCoin. To ensure efficient data management, we've harnessed the power of TheGraph, constructing an indexer for our CompaignFactoryManager on Ethereum's Sepolia. 

Our chain-related partnerships have been instrumental. Scroll, Metamask (Linea), and Base have played pivotal roles in our deployment strategy. Deploying our contracts across Scroll Testnet, Linea Goerli Testnet, Base Goerli, and Sepolia Ethereum, we've strived for comprehensive testing and seamless integration across various blockchain environments.


# Solidity contracts



# Main architecture

Three contracts will manage all the logic of the platform ThreeFundMe.


## CompaignFactoryManager.sol


The factory manager will manage as a global storage of all the compaigns created by the users.

## CompaignFactory.sol

The factory will create a new compaign and will store it in the factory manager.


## Compaign.sol

The compaign will manage all the logic of the compaign, the compaign will be created by the factory and will be stored in the factory manager.



# Chain Deployments


## Scroll Testnet
ApeCoin deployed at:  0x2298697129DEb8EB43b73A11bfb738BC1f35F0c2
https://sepolia.scrollscan.dev/address/0x2298697129DEb8EB43b73A11bfb738BC1f35F0c2
FactoryManager deployed at:  0x44dACEc546c52A1488d21463B6DF68E2a92A2Cbb
https://sepolia.scrollscan.dev/address/0x44dACEc546c52A1488d21463B6DF68E2a92A2Cbb
Compaign deployed at:  0xFC1Be3Ed0F9821a83e1123476b2F48de6D6506Ec
https://sepolia.scrollscan.dev/address/0xFC1Be3Ed0F9821a83e1123476b2F48de6D6506Ec
Factory deployed at:  0x862FF2Cb647A2F284d79a7296b98361334433D68
https://sepolia.scrollscan.dev/address/0x862FF2Cb647A2F284d79a7296b98361334433D68

## Linea Testnet
ApeCoin deployed at:  0xDac05a10F2eF236DFB93a9A4f50d2596B094C272
https://goerli.lineascan.build/address/0xDac05a10F2eF236DFB93a9A4f50d2596B094C272#code
FactoryManager deployed at:  0x51C21b82Cb26CD1Eb5126Abc655533212866a066
https://goerli.lineascan.build/address/0x51C21b82Cb26CD1Eb5126Abc655533212866a066#code
Compaign deployed at:  0xF3B1e4a58bB4c4CBf4280A689b7a4FE2f1db5D38
https://goerli.lineascan.build/address/0xF3B1e4a58bB4c4CBf4280A689b7a4FE2f1db5D38#code
Factory deployed at:  0x3a29Dcd9f39Be75b1197900F04458Bc87F9eE636
https://goerli.lineascan.build/address/0x3a29Dcd9f39Be75b1197900F04458Bc87F9eE636#code


## Base Goerli
ApeCoin deployed at:  0x3a29Dcd9f39Be75b1197900F04458Bc87F9eE636
https://goerli.basescan.org/address/0x3a29Dcd9f39Be75b1197900F04458Bc87F9eE636#code
FactoryManager deployed at:  0xDf797C8461756C46902d0242d9f59f743f9913d4
https://goerli.basescan.org/address/0xDf797C8461756C46902d0242d9f59f743f9913d4#code
Compaign deployed at:  0xa22c013AFe31f6037e12a8a178FeaF20f1c2630d
https://goerli.basescan.org/address/0xa22c013AFe31f6037e12a8a178FeaF20f1c2630d#code
Factory deployed at:  0x2298697129DEb8EB43b73A11bfb738BC1f35F0c2
https://goerli.basescan.org/address/0x2298697129DEb8EB43b73A11bfb738BC1f35F0c2#code

## Ethereum Sepolia Testnet

ApeCoin deployed at:  0xcF2A5043cDD1fE0d1f540Cd0D3dd32E3917F04c2
https://sepolia.etherscan.io/address/0xcF2A5043cDD1fE0d1f540Cd0D3dd32E3917F04c2#code
FactoryManager deployed at:  0xA7e67d2cf122E914a87ABEAD75508A13D9d855D8
https://sepolia.etherscan.io/address/0xA7e67d2cf122E914a87ABEAD75508A13D9d855D8#code
Compaign deployed at:  0x21e63FaD5ccc4492ffE73284b3327aa0c1429CDC
https://sepolia.etherscan.io/address/0x21e63FaD5ccc4492ffE73284b3327aa0c1429CDC#code
Factory deployed at:  0xE28503BE72a11ca99c51770b894Aa19fE05ab3E8
https://sepolia.etherscan.io/address/0xE28503BE72a11ca99c51770b894Aa19fE05ab3E8#code


# TheGraph Deployment

## Ethereum Sepolia Testnet

Link https://api.studio.thegraph.com/query/58883/threefundme/version/latest


