pragma solidity ^0.8.20;



interface ICompaignFactoryManager {


    function fees(address tokenAddress) external view returns (uint);
    function feeAddress() external view returns (address);
    function registerContributionUser(address user, address compaign) external;
    function registerCompaign(address compaign, address owner) external;
    function removeContributionUser(address user, address compaign) external;
    function allowedTokensCurrency(address token) external view returns(bool);
}