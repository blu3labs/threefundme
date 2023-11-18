const {ethers} = require("hardhat")
const {expect} = require("chai")


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

    let step1expire = (Date.now() / 1000  + 60).toFixed(0)

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
                    "10000000000000000000",
                    step1expire
                ],
                [
                    ["step2"],
                    [],
                    "30000000000000000000",
                    step2expire,
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
        let compaign = await ethers.getContractAt("Compaign", result.events[result.events.length - 1].address)

        // creation of post


    })



    it("Compaign fail")
})