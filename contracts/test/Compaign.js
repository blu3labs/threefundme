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

        tx = await compaign.collectTokens()
        await tx.wait()

        let contrib2=  await compaign.contribute("10000000000000000000")

        await contrib2.wait()

        let post3 = await compaign.makePost(1,["Myyy second postt guys", "here we go"])
        await post3.wait()
        let post4 = await compaign.makePost(1,["Myyy second postt memoo", "here we go"])
        await post4.wait()
        let post5 = await compaign.makePost(1,["Myyy second postt memoo", "here we go"])
        await post5.wait()
        let info3 = await compaign.getCompaignInfo()
        console.log(info3)

    })



    it("Withdraw test",  async () => {
        let step1expireWithdraw = ( Date.now() / 1000  + 2200).toFixed(0)

        let step2expireWithdraw = ( Date.now() / 1000  + 8600).toFixed(0)

        const compaignInfo = [
          ["MyCompaign","compaign"],
          [],
          ape.address,
          owner.address,
          [
            [
            ["stepinfo"],
            [],
            step1expireWithdraw,
            "10000000000000000000",
          
            ],
            [
              ["step2info"],
              [],
              step2expireWithdraw,
              "30000000000000000000",

              ],
          ]
        ]

        let txapprov = await ape.approve(factory.address, "1500000000000000000000")
        await txapprov.wait()
        let tx = await factory.createCompaign(compaignInfo)
       let result =  await tx.wait()



       let compaign = await ethers.getContractAt("Compaign", result.events[result.events.length - 3].address)
   

    // let post = await compaign.makePost(0,["Myyy new postt guys", "here we go"])
    // await post.wait()

    // let post2 = await compaign.makePost(0,["Myyy second postt guys", "here we go"])
    // await post2.wait()
    let fac = await compaign.factoryManager()
    console.log("fac ", fac)
    let txapprov2 = await ape.approve(compaign.address, "1500000000000000000000")
    await txapprov2.wait()
    let info2 = await compaign.getCompaignInfo()
    console.log("before fail", info2)

    let contrib=  await compaign.contribute("1000000000000000000")

   contrib=  await contrib.wait()
    
   console.log("contributed")

   // batch of contrib
   let txapprov3 = await ape.connect(addr1).approve(compaign.address, "1500000000000000000000")
   await txapprov3.wait()
   let contrib2=  await compaign.connect(addr1).contribute("1000000000000000000")

   contrib2=  await contrib2.wait()
   let txapprov4 = await ape.connect(addr2).approve(compaign.address, "1500000000000000000000")
   await txapprov4.wait()

   let contrib3=  await compaign.connect(addr2).contribute("1000000000000000000")

   contrib3=  await contrib3.wait()
    
 
   console.log("contribution tx ", contrib)
    await time.increaseTo(ethers.utils.hexlify(ethers.BigNumber.from(step1expireWithdraw).add(1)));
  
 // should be failed now.

 // try withdraw

 let oldbal = await ape.balanceOf(owner.address)

 let totalpart = await compaign.getTotalParticipants()
 console.log(totalpart)
 let usercontrib = await compaign.getUserContribution(0)
 console.log("usercontrib ", usercontrib)
 let infoo = await compaign.getCompaignInfo()
   tx =  await compaign.withdraw(infoo.currentStatus) // stepid 
   await tx.wait()


 let newbal = await ape.balanceOf(owner.address)

 console.log("old bal ", new BigNumber(oldbal._hex).div(10**18).toString(10), " new bal ", new BigNumber(newbal._hex).div(10**18).toString(10))


    let info = await compaign.getCompaignInfo()
    console.log(info,"info last")


    expect(info.statusCompaign).to.be.equal(0)
 // test getters
 
 
 const getAllContribByCompaign = await factoryManager.getAllContributionsByCompaign(compaign.address)
 console.log("getAllContribByCompaign ", getAllContribByCompaign)

    const getAllContribByUser = await factoryManager.getAllContributionsByUser(owner.address)

    console.log("getAllContribByUser ", getAllContribByUser)
})
})