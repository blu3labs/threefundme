pragma solidity ^0.8.20;


interface ICompaignFactory {


    error InvalidApprovalToken(address token, address wallet, uint amount);
    error InsufficientFee(address token, uint amount);
}