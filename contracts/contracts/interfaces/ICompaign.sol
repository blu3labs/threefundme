pragma solidity ^0.8.20;

interface ICompaign {


    struct PostInfo {
        string[] details; // contains all the details of the post like title, description, some images banners, etc.
        uint timestamp; // timestamp of the post
    }


    struct StepInfo {
        string[] stepDetails; // contains the details of the step like title, description, goal of the step
        uint[] numericDetails; // if needed some numeric details in the future, we can use the array.
        uint expireTime; // each step have a expire time, if the step is not completed in the given time, the step will be failed
        uint amountToBeRaised; // amount to be raised in the step


    }

    struct CompaignInfo {
        string[] details; // contains all the details of the compaign like title, description, some images banners, etc.
        uint[] numericDetails; // if needed some numeric details in the future, we can use the array.
        address currency; // address of the currency in which the compaign can be funded
        address owner;
        StepInfo[] steps; // steps of the compaign
    }

    struct UserContribution {
        uint amount;
        uint timestamp;
        address contributor;
    }

 

    
    
}