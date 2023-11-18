pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ICompaignFactoryManager.sol";
import "./interfaces/ICompaign.sol";

// The compaign factory will create the Compaign address and will register the compaign in the CompaignFactoryManager
contract CompaignFactory is Initializable, ReentrancyGuard, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    address public implementation; 
    address public compaignFactoryManager;


    event CompaignCreated(address indexed compaign, address indexed owner);
    constructor(address impl, address fm) {
        implementation = impl;
        compaignFactoryManager = fm;
    }

    modifier onlyAllowedToken(address token) {
        require(ICompaignFactoryManager(compaignFactoryManager).allowedTokensCurrency(token), "Token not allowed");
        _;
    }

    modifier manageFees(address tokenAddress) {
        //TODO
    }
    function setImplementation( address newImpl) external onlyOwner {
        implementation = newImpl;
    }

    function createCompaign(ICompaign.CompaignInfo memory info) external payable onlyAllowedToken(info.currency) nonReentrant manageFees(info.currency) {
        address compaignAddress;
        {
            compaignAddress = Clones.clone(implementation);
        }
        ICompaign(compaignAddress).initialize(info, compaignFactoryManager);
        ICompaignFactoryManager(compaignFactoryManager).registerCompaign(compaignAddress, msg.sender);
        emit CompaignCreated(compaign, msg.sender);
    }

}