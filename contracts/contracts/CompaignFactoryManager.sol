pragma solidity ^0.8.20;


import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract CompaignFactoryManager is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;


    mapping(address => bool) public allowedTokensCurrency;
    mapping(address => uint) public fees;
    mapping(address => address) public ownersOfCompaign; // compaign adedr => owner
    address public feeAddress;
    mapping(address => address[]) public compaignsOfOwner; // owner => array of compaign
    mapping(address => bool) public factories;
    mapping(address => bool) public compaignValid;
    mapping(address => address[]) public contributionsOfUsers;
    mapping(address => address[]) public contributionsOfCompaign;
    EnumerableSet.AddressSet compaignList;

    mapping(address => mapping( address => uint)) public userContributionIndex;


    event CompaignCreated(address indexed compaign, address indexed owner);
    event CompaignContributionReceived(address indexed compaign, address indexed contributor);
    constructor()  public {

    }
    
    modifier onlyFactory {
        require(factories[msg.sender], "Only factory can call this function");
        _;
    }

    modifier onlyCompaign {
        require(compaignValid[msg.sender], "Only compaign can call this function");
        _;
    }

    function setFactory(address fac, bool value) external onlyOwner {
        factories[fac] = value;
    }

    function setAllowedTokenCurrency(address currency, bool value) external onlyOwner {
        allowedTokensCurrency[currency] = value;
    }

    function setFeeAddress(address _feeAddress) external onlyOwner {
        feeAddress = _feeAddress;
    }

    function setFee(address token, uint fee) external onlyOwner {
        fees[token] = fee;
    }

    function registerCompaign(address compaign, address owner) external onlyFactory {
        compaignList.add(compaign);
        compaignValid[compaign] = true;
        ownersOfCompaign[compaign] = owner;
        address[] memory list = new address[](compaignsOfOwner[owner].length + 1);
        for(uint i = 0; i < compaignsOfOwner[owner].length; i++) {
            list[i] = compaignsOfOwner[owner][i];
        }
        list[compaignsOfOwner[owner].length] = compaign;
        compaignsOfOwner[owner] = list;

        emit CompaignCreated(compaign, owner);
    }

       function registerContributionUser(address user, address compaign) external onlyCompaign {
        uint index = contributionsOfUsers[user].length;
        userContributionIndex[user][compaign] = index;
        address[] memory list = new address[](contributionsOfUsers[user].length + 1);
        for(uint i = 0; i < contributionsOfUsers[user].length; i++) {
            list[i] = contributionsOfUsers[user][i];
        }
        list[contributionsOfUsers[user].length] = compaign;
        contributionsOfUsers[user] = list;

        address[] memory list2 = new address[](contributionsOfCompaign[compaign].length + 1);
        for(uint i = 0; i < contributionsOfCompaign[compaign].length; i++) {
            list2[i] = contributionsOfCompaign[compaign][i];
        }
        list2[contributionsOfCompaign[compaign].length] = user;
        contributionsOfCompaign[compaign] = list2;
        emit CompaignContributionReceived(compaign, user);
    }

    function removeContributionUser(address user, address compaign) external onlyCompaign {
        uint index = userContributionIndex[user][compaign];
        require(contributionsOfUsers[user][index] == compaign, "No contribution found");
        contributionsOfUsers[user][index] = address(0);
    }

    function getAllCompaigns() external view returns (address[] memory) {
        address[] memory list = new address[](compaignList.length());
        for(uint i = 0; i < compaignList.length(); i++) {
            list[i] = compaignList.at(i);
        }
        return list;
    }

    function getAllCompaignsByStartEnd(uint start, uint end) external view returns(address[] memory) {
        address[] memory list = new address[](end - start + 1);
        for(uint i = start; i <= end; i++) {
            list[i - start] = compaignList.at(i);
        }
        return list;
    }

    // get contributions by user

    function getAllContributionsByUser(address user) external view returns(address[] memory) {
        return contributionsOfUsers[user];
    }

    function getAllContributionsByUserByStartEnd(address user, uint start, uint end) external view returns(address[] memory) {
        address[] memory list = new address[](end - start + 1);
        for(uint i = start; i <= end; i++) {
            list[i - start] = contributionsOfUsers[user][i];
        }
        return list;
    }


    // get contributions by compaign

    function getAllContributionsByCompaign(address compaign) external view returns(address[] memory) {
        address[] memory list = new address[](contributionsOfCompaign[compaign].length);
        uint index = 0;
        for(uint i = 0; i < contributionsOfCompaign[compaign].length; i++) {
            if (contributionsOfCompaign[compaign][i] == address(0)) {
                continue;
            }
            list[index] = contributionsOfCompaign[compaign][i];
            index++;
        }

        address[] memory officialList = new address[](index);

        for(uint i = 0; i < index; i++) {
            officialList[i] = list[i];
        }
    }

       function getAllContributionsByCompaign(address compaign, uint start, uint end) external view returns(address[] memory) {
        address[] memory list = new address[](contributionsOfCompaign[compaign].length);
        uint index = 0;
        for(uint i = 0; i < contributionsOfCompaign[compaign].length; i++) {
            if (contributionsOfCompaign[compaign][i] == address(0)) {
                continue;
            }
            list[index] = contributionsOfCompaign[compaign][i];
            index++;
        }

        address[] memory officialList = new address[](index);

        for(uint i = start; i < end; i++) {
            officialList[i] = list[i];
        }
    }


    // 

}