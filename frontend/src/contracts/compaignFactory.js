export const compaignFactoryAddress = {
  11155111: "0x5bfA197D4659b2A32bA40CFDC678782D648aED89",
  undefined: "0x5bfA197D4659b2A32bA40CFDC678782D648aED89",
  84531: "0x2298697129DEb8EB43b73A11bfb738BC1f35F0c2",
  59140: "0x3a29Dcd9f39Be75b1197900F04458Bc87F9eE636",
  534351: "0x862FF2Cb647A2F284d79a7296b98361334433D68",
};

export const compaignFactoryAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "impl",
        type: "address",
      },
      {
        internalType: "address",
        name: "fm",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "InsufficientFee",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "InvalidApprovalToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "compaign",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "CompaignCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "compaignFactoryManager",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string[]",
            name: "details",
            type: "string[]",
          },
          {
            internalType: "uint256[]",
            name: "numericDetails",
            type: "uint256[]",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            components: [
              {
                internalType: "string[]",
                name: "stepDetails",
                type: "string[]",
              },
              {
                internalType: "uint256[]",
                name: "numericDetails",
                type: "uint256[]",
              },
              {
                internalType: "uint256",
                name: "expireTime",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amountToBeRaised",
                type: "uint256",
              },
            ],
            internalType: "struct ICompaign.StepInfo[]",
            name: "steps",
            type: "tuple[]",
          },
        ],
        internalType: "struct ICompaign.CompaignInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "createCompaign",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImpl",
        type: "address",
      },
    ],
    name: "setImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
