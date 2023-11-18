# threefundme contracts



# Main architecture

Three contracts will manage all the logic of the platform ThreeFundMe.


## CompaignFactoryManager.sol


The factory manager will manage as a global storage of all the compaigns created by the users.

## CompaignFactory.sol

The factory will create a new compaign and will store it in the factory manager.


## Compaign.sol

The compaign will manage all the logic of the compaign, the compaign will be created by the factory and will be stored in the factory manager.