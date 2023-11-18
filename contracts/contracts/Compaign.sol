pragma solidity ^0.8.20;


import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "./interfaces/ICompaign.sol";
import "./interfaces/ICompaignFactoryManager.sol";


// main logic of the compaign
contract Compaign is  ERC721Upgradeable {
    using EnumerableSet for EnumerableSet.AddressSet;
    enum StatusCompaign {
        FAILED,
        SUCCESS,
        STEP_SWITCH_REQUIRED,
        ACTIVE
    }
    struct StepStateInfo {
        uint expireTime;
        uint stepId;
        uint currentAmount;
        bool collected;
        ICompaign.PostInfo[] posts;
    }

    struct CompaignFullInfo {
        ICompaign.CompaignInfo compaign;
        uint currentStatus;
        uint totalAmount;
        StatusCompaign statusCompaign;
        StepStateInfo[] allSteps;
    }

    struct UserContributionFullInfo {
        uint amount;
        address contributor;
        uint timestamp;
        uint stepId;
    }




    event PostPublished(string title, uint stepId);
    event Withdraw(address indexed contributor, uint amount);
    event TokenCollected(address indexed owner, uint amount, uint stepId);
    event NextStepSwitch(address indexed owner, uint oldStep, uint newStep);
    event UserContributed(address indexed contributor, uint amount);

    // address => step => contribution
    // means that each address should have a contribution for a specific step.
    mapping(address => mapping(uint => ICompaign.UserContribution)) public userContributions;

    EnumerableSet.AddressSet contributorsAddress;
    ICompaign.CompaignInfo compaignDetails;
    mapping(address => mapping(uint => bool)) public hasContribute;
    mapping(address => uint) public contributorTokenId;
    mapping(uint => uint) public stepCollect;
    uint public currentStepStatus;
    mapping(uint => mapping(uint => ICompaign.PostInfo)) public posts;
    mapping(uint => uint) public postsLengthForStep;
    mapping(uint => StepStateInfo) public stepStateInfo;
    mapping(uint => bool) public stepAmountCollected;

    uint public totalAmount;
    address public factoryManager;

    modifier onlyBuyer(uint stepId) {
        require(hasContribute[msg.sender][stepId], "Only buyer can call this function");
        _;
    }
    modifier onlyCompaignOwner() {
        require(msg.sender == compaignDetails.owner, "Only compaign owner can call this function");
        _;
    }

    function initialize(ICompaign.CompaignInfo calldata info, address factoryManager_ ) public initializer {
        __ERC721_init(info.details[0], info.details[0]);
        compaignDetails = info;
        factoryManager = factoryManager_;
    }  

    function transferFrom(address from, address to, uint tokenId) public override {
        require(from == address(this) || to == address(this), "Only factory manager can transfer the token");
        super.transferFrom(from, to, tokenId);
    }

    function getStatusCompaign() public view returns(StatusCompaign) {
        ICompaign.StepInfo memory step = compaignDetails.steps[currentStepStatus];
        if (block.timestamp > step.expireTime && step.amountToBeRaised > totalAmount) {
            return StatusCompaign.FAILED;
        } else if (block.timestamp > step.expireTime && step.amountToBeRaised >= totalAmount) {
            return StatusCompaign.STEP_SWITCH_REQUIRED;
        } else if (currentStepStatus == compaignDetails.steps.length - 1 &&  step.amountToBeRaised >= totalAmount) {
            return StatusCompaign.SUCCESS;
        } else {
            return StatusCompaign.ACTIVE;
        }
    }

    function makePost(uint stepId, string[] calldata postDetails) external onlyCompaignOwner {
       if (compaignDetails.steps.length < stepId) {
        revert ICompaign.NoStepFound(stepId);
       }
       if (stepId != currentStepStatus) {
         revert ICompaign.OnlyCurrentStep(stepId);
       }

       if (block.timestamp > compaignDetails.steps[stepId].expireTime) {
         revert ICompaign.StepExpired(stepId);
       }
       require(getStatusCompaign() == StatusCompaign.ACTIVE || getStatusCompaign() == StatusCompaign.SUCCESS,"Compaign not available");
        ICompaign.PostInfo memory postInfo = ICompaign.PostInfo({
            details: postDetails,
            timestamp: block.timestamp
        });

    
        posts[stepId][postsLengthForStep[stepId] + 1] = postInfo;
        postsLengthForStep[stepId]++;
        emit PostPublished(postDetails[0], stepId);


    }

    function contribute(uint amount) external payable {
            // check collected
        if (currentStepStatus > 0 ){
            require(stepAmountCollected[currentStepStatus - 1], "Tokens not yet collected");
        }
        require(getStatusCompaign() != StatusCompaign.FAILED &&  compaignDetails.steps[currentStepStatus].amountToBeRaised > stepCollect[currentStepStatus], "Step completed or failed");
        if (compaignDetails.currency == address(0)) {
            require(msg.value >= amount, "Invalid amount");
        }else {
            ERC20(compaignDetails.currency).transferFrom(msg.sender, address(this), amount);
        }
        ICompaign.UserContribution memory userCont =  userContributions[msg.sender][currentStepStatus];
        uint newTokenId = uint160(address(msg.sender)) + currentStepStatus + block.timestamp;

        if (userCont.timestamp == 0) {
            // not yet contributed.
            userCont.timestamp = block.timestamp;
            userCont.amount = amount;
            newTokenId += contributorsAddress.length();
            userContributions[msg.sender][currentStepStatus] = userCont;

            if(!contributorsAddress.contains(msg.sender)) {
            super._mint(msg.sender, newTokenId);
            contributorTokenId[msg.sender] = newTokenId;
          
                contributorsAddress.add(msg.sender);
            }
        } else {
            userCont.amount += amount;
        }

        
        hasContribute[msg.sender][currentStepStatus] = true;
        ICompaignFactoryManager(factoryManager).registerContributionUser(msg.sender, address(this));
        totalAmount += amount;
        stepCollect[currentStepStatus] += amount;
      
        emit UserContributed(msg.sender, amount);
    }

    function collectTokens() external onlyCompaignOwner  {
        require(getStatusCompaign() == StatusCompaign.SUCCESS, "Step not yet successfuly finished");
        // posts checks
        ICompaign.StepInfo memory stepInfo = compaignDetails.steps[currentStepStatus - 1];
        if (postsLengthForStep[currentStepStatus - 1] < 2) {
            revert ICompaign.NoEnoughPosts(currentStepStatus);
        }
        if (compaignDetails.currency == address(0)) {
            payable(compaignDetails.owner).transfer(stepInfo.amountToBeRaised);
        } else {
            ERC20(compaignDetails.currency).transfer(compaignDetails.owner, stepInfo.amountToBeRaised);
        }

        stepAmountCollected[currentStepStatus - 1] = true;
        emit TokenCollected(compaignDetails.owner, stepInfo.amountToBeRaised, currentStepStatus);
    }

    function switchStep() external onlyCompaignOwner {
        if (getStatusCompaign() != StatusCompaign.STEP_SWITCH_REQUIRED) {
            revert ICompaign.StepCantSwitch(currentStepStatus);
        }
        // require(getStatusCompaign() == StatusCompaign.STEP_SWITCH_REQUIRED, "Step cannot be switch");
        currentStepStatus = currentStepStatus + 1;
        emit NextStepSwitch(compaignDetails.owner, currentStepStatus - 1, currentStepStatus);
    }

   function withdraw(uint stepId) external  onlyBuyer(stepId) {
        require(getStatusCompaign() == StatusCompaign.FAILED, "Compaign not failed");
        ICompaign.UserContribution memory userCont = userContributions[msg.sender][currentStepStatus];
        if (userCont.timestamp <= 0) {
            revert ICompaign.ContributionNotFound(msg.sender, currentStepStatus);
        }
        // require(userCont.timestamp > 0, "Contribution not found");
        if (compaignDetails.currency == address(0)) {
            payable(msg.sender).transfer(userCont.amount);
        } else {
            ERC20(compaignDetails.currency).transfer(msg.sender, userCont.amount);
        }
        uint tokenId = contributorTokenId[msg.sender];

        super.transferFrom(msg.sender, address(this), tokenId);
        super._burn(tokenId);
     
        contributorsAddress.remove(msg.sender);
        ICompaignFactoryManager(factoryManager).removeContributionUser(msg.sender, address(this));
        emit Withdraw(msg.sender, userCont.amount);
    }

    // getters

    // need to be tested
    function getTotalParticipants() external view returns(UserContributionFullInfo[] memory) {
        UserContributionFullInfo[] memory listContributions = new UserContributionFullInfo[](contributorsAddress.length());

        // need to be optimized.
        for(uint stepA = 0; stepA < compaignDetails.steps.length; stepA++) {
            for(uint i = 0; i < contributorsAddress.length(); i++) {
                address contributor = contributorsAddress.at(i);
                ICompaign.UserContribution memory userCont = userContributions[contributor][stepA];

                if (userCont.timestamp <= 0) {
                    continue;
                }
                UserContributionFullInfo memory full = UserContributionFullInfo({
                    amount: userCont.amount,
                    contributor: contributor,
                    timestamp: userCont.timestamp,
                    stepId: stepA
                });

                listContributions[i] = full;
            }
        }

        return listContributions;
    }

    function getUserContributionByStartEnd(uint start, uint end, uint stepId ) external view returns(UserContributionFullInfo[] memory) {
        UserContributionFullInfo[] memory listContributions = new UserContributionFullInfo[](end - start);
        uint index = 0;
        for (uint i = start; i < end; i++) {
            address contributor = contributorsAddress.at(i);
            ICompaign.UserContribution memory userCont = userContributions[contributor][stepId];
            UserContributionFullInfo memory full = UserContributionFullInfo({
                amount: userCont.amount,
                contributor: contributor,
                timestamp: userCont.timestamp,
                stepId: stepId
            });
            listContributions[index] = full;
            index++;
        }
        return listContributions;
    }
    
    function getUserContribution(uint stepId) external view returns(UserContributionFullInfo[] memory) {
        UserContributionFullInfo[] memory listContributions = new UserContributionFullInfo[](contributorsAddress.length());

    
        for (uint i = 0; i < contributorsAddress.length(); i++) {
            address contributor = contributorsAddress.at(i);
        

            ICompaign.UserContribution memory userCont = userContributions[contributor][stepId];
            UserContributionFullInfo memory full = UserContributionFullInfo({
                amount: userCont.amount,
                contributor: contributor,
                timestamp: userCont.timestamp,
                stepId: stepId
            });
            listContributions[i] = full;
         
        }

        return listContributions;
    }
    
    function getCompaignInfo() external view returns(CompaignFullInfo memory) {
        ICompaign.PostInfo[] memory listPosts = new ICompaign.PostInfo[](postsLengthForStep[currentStepStatus]);
        for(uint i = 0; i < postsLengthForStep[currentStepStatus]; i++) {
            listPosts[i] = posts[currentStepStatus][i + 1];
        }

        StepStateInfo[] memory listSteps =  new StepStateInfo[](compaignDetails.steps.length);
        for(uint i = 0; i < compaignDetails.steps.length; i++) {
            listSteps[i] = StepStateInfo({
                expireTime: compaignDetails.steps[i].expireTime,
                stepId: i,
                currentAmount: stepCollect[i],
                collected: stepAmountCollected[i],
                posts: new ICompaign.PostInfo[](postsLengthForStep[i])
            });
        }
        CompaignFullInfo memory full = CompaignFullInfo({
            compaign: compaignDetails,
            currentStatus: currentStepStatus,
            totalAmount: totalAmount,
            statusCompaign: getStatusCompaign(),
            allSteps: listSteps

        });
        return full;
    }

}