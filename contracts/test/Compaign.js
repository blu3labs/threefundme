const {ethers} = require("hardhat")
const {expect} = require("chai")
const { time } = require( "@nomicfoundation/hardhat-network-helpers");
const BigNumber = require("bignumber.js")

describe("Compaign", function() {

    let compaign, owner, addr1, addr2, factory, factoryManager, impl, ape
    this.beforeEach(async () => {
        // we will run this function before each test
        owner = (await ethers.getSigners())[0]
        addr1 = (await ethers.getSigners())[1]
        addr2 = (await ethers.getSigners())[2]
        factoryManager = await ethers.getContractFactory("CompaignFactoryManager")
        factoryManager = await factoryManager.deploy()
        factory = await ethers.getContractFactory("CompaignFactory")
        impl = await ethers.getContractFactory("Compaign")
        impl = await impl.deploy()
        factory = await factory.deploy(impl.address, factoryManager.address)
        let tx = await factoryManager.setFactory(factory.address, true)
        await tx.wait()
        ape = await ethers.getContractFactory("Ape")
        ape = await ape.deploy("APE","APE","10000000000000000000000000000000")
        
        tx = await factoryManager.setAllowedTokenCurrency(ape.address, true)
        await tx.wait()
        tx = await factoryManager.setFee(ape.address, "10000000")
        await tx.wait()
        tx = await factoryManager.setFeeAddress(addr1.address)
        await tx.wait()

        tx = await ape.transfer(addr1.address, "10000000000000000000000000")
        await tx.wait()
        tx = await ape.transfer(addr2.address, "10000000000000000000000000")
        await tx.wait()
    })

    let step1expire = (Date.now() / 1000  + 1200).toFixed(0)

    it("Main features compaign", async function() {
        let step2expire = ( Date.now() / 1000  + 6600).toFixed(0)

        console.log("test")
        const compaignInfo = [
            ["MyCompaign", "compaign"],
            [],
            ape.address,
            owner.address,
            [
                // steps 
                [
                    ["step1"],
                    [],
               
                    step1expire,
                    "10000000000000000000"
                ],
                [
                    ["step2"],
                    [],
            
                    step2expire,
                    "30000000000000000000"
                ]
            ]
        ]
        console.log(compaignInfo)
        let approveTx = await ape.approve(factory.address, "1500000000000000000000")
        await approveTx.wait()
        console.log("approved")
        let tx = await factory.createCompaign(compaignInfo)
        let result = await tx.wait()
        console.log(result)
        let compaign = await ethers.getContractAt("Compaign", result.events[result.events.length - 3].address)

        // creation of post
        console.log("created")

        let info  =await compaign.getCompaignInfo()
        console.log(info, "info")

        let post = await compaign.makePost(0,["Myyy first postt", "here we go"])
        await post.wait()
        console.log("post 1 ok")
    
        let post2 = await compaign.makePost(0,["Myyy second postt", "here we go"])
        await post2.wait()

        let txapprov2 = await ape.approve(compaign.address, "1500000000000000000000")
        await txapprov2.wait()

        let contribution = await compaign.contribute("10000000000000000000")
        await contribution.wait()


        //we need to wait until step1expire.
        await time.increaseTo(ethers.utils.hexlify(ethers.BigNumber.from(step1expire).add(1)));
  
        let info2  =await compaign.getCompaignInfo()
        console.log(info2, "info")
        // able to change to next step.
        tx = await compaign.switchStep()
        await tx.wait()

    })



    it("Compaign fail")
})