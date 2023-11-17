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



contract Compaign is Initializable, ERC721Upgradeable {
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
        uint currenStatus;
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
    mapping(uint => mappin(uint => ICompaign.PostInfo)) public posts;
    mapping(uint => uint) public postsLengthForStep;
    mapping(uint => StepStateInfo) public stepStateInfo;
    mapping(uint => bool) public stepAmountCollected;

    uint public totalAmount;
    address public factoryManager;

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

    function makePost(uint stepId, string[] calldata postDetails) external onlyCompaign {
       if (compaignDetails.steps.length < stepId) {
        revert ICompaign.NoStepFound(stepId);
       }
       if (stepId != currentStepStatus) {
         revert ICompaign.OnlyCurrentStep(stepId);
       }

       if (block.timestamp > compaignDetails.steps[stepId].expireTime) {
         revert ICompaign.StepExpired(stepId);
       }
       require(getStatusCompaigned() == StatusCompaign.ACTIVE || getStatusCompaign() == StatusCompaign.SUCCESS,"Compaign not available");

       

    }




}