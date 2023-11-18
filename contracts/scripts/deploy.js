// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config()

async function main() {

  // create factory manager
  
  console.log("Deployment started..")
  let apecoin = await hre.ethers.getContractFactory("ApeCoin")
  apecoin = await apecoin.deploy("ApeCoin","ApeCoin","10000000000000000000000000000000")

  console.log("ApeCoin deployed at: ", apecoin.address)
  let factoryManager = await hre.ethers.getContractFactory("CompaignFactoryManager")

  factoryManager = await factoryManager.deploy()

  console.log("FactoryManager deployed at: ", factoryManager.address)

  let factory = await hre.ethers.getContractFactory("CompaignFactory")

  let impl = await hre.ethers.getContractFactory("Compaign")

  impl = await impl.deploy()

  console.log("Compaign deployed at: ", impl.address)
  factory = await factory.deploy(impl.address, factoryManager.address)

  console.log("Factory deployed at: ", factory.address)

  await factoryManager.setFee(apecoin.address, "10000000")
  await factoryManager.setFeeAddress(process.env.FEE_ADDRESS)
  await factoryManager.setAllowedTokenCurrency(apecoin.address, true)
  await  factoryManager.setFactory(factory.address, true)

 let tx = await apecoin.transfer("0x840464E0332Df2957DF5b7Cc22460B8f7e572481","100000000000000000000000")
  await tx.wait()
  console.log("FactoryManager configured")
  console.log("Deployment finished");

  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
