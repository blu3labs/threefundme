import React, { useState, useEffect } from "react";
import "./index.css";
import {
  Card,
  Input,
  FileInput,
  CrossSVG,
  PlusSVG,
  Typography,
  Button,
  Textarea,
} from "@ensdomains/thorin";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import {
  useAccount,
  useNetwork,
  useWalletClient,
  useSwitchNetwork,
  erc20ABI,
} from "wagmi";
import { toast } from "react-hot-toast";
import { writeContract } from "../../utils/writeContract";
import {
  compaignFactoryAbi,
  compaignFactoryAddress,
} from "../../contracts/compaignFactory";
import { walletClientToSigner } from "../../utils/walletConnectToSigner";
import { addFile } from "../../utils/addFileHook";
import { apeCoinAddresses } from "../../contracts/ape";
import rpc from "../../utils/rpc.json";
function Create() {
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: walletCl } = useWalletClient();
  const [createData, setCreateData] = useState({
    logo: "",
    banner: "",
    name: "",
    telegram: "",
    twitter: "",
    website: "",
    descripiton: "",
    minBuy: "",
    totalPrice: "",
    steps: [],
  });
  const [banner, setBanner] = useState();
  const [logo, setLogo] = useState();
  const [logoPreview, setLogoPreview] = useState();
  const [bannerPreview, setBannerPreview] = useState();
  const convertPreview = () => {
    if (banner) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(banner);
    } else {
      setBannerPreview(null);
    }
  };
  const convertlogoPreview = () => {
    if (logo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(logo);
    } else {
      setLogoPreview(null);
    }
  };
  console.log(bannerPreview, "logoPreview", banner);
  useEffect(() => {
    convertPreview();
    convertlogoPreview();
  }, [logo, banner]);
  const [stepArray, setStepArray] = useState([
    {
      step: 1,
      title: "",
      price: "",
      date: "",
    },
    {
      step: 2,
      title: "",
      price: "",
      date: "",
    },
  ]);
  const [loading, setLoading] = useState();
  const handleCreate = async () => {
    try {
      setLoading(true);
      const signer = walletClientToSigner(walletCl);
      const logoUrl = await addFile(logo);
      console.log(logoUrl, "logoUrl");
      const bannerUrl = await addFile(banner);
      console.log(bannerUrl, "bannerUrl");
      let steps = [];
      for (let i in stepArray) {
        steps.push([
          [stepArray[i].title],
          [],
          new Date(stepArray[i].date).getTime() / 1000,
          ethers.utils.parseEther(stepArray[i].price),
        ]);
      }
      const handleCreateData = [
        [
          createData.name,
          createData.telegram,
          createData.twitter,
          createData.website,
          createData.descripiton,
          logoUrl,
          bannerUrl,
        ],
        [
          ethers.utils.parseEther(createData.minBuy?.toString()),
          ethers.utils.parseEther(createData.totalPrice?.toString()),
        ],
        apeCoinAddresses[chain?.id],
        address,
        [...steps],
      ];
      const tx = await writeContract({
        address: compaignFactoryAddress[chain?.id],
        abi: compaignFactoryAbi,
        method: "createCompaign",
        args: [handleCreateData],
        signer: signer,
        chainId: chain?.id,
        switchNetworkAsync: switchNetworkAsync,
      });
      await tx.wait()
      setLoading(false);
      console.log(tx, "tx");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const [userBalance, setUserBalance] = useState({
    allowance: 0,
    balance: 0,
  });
  const fethcUserAllowance = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpc[chain?.id]);
      console.log(apeCoinAddresses[chain?.id], "apeCoinAddress");
      const contract = new ethers.Contract(
        apeCoinAddresses[chain?.id],
        erc20ABI,
        provider
      );
      const balance = await contract.balanceOf(address);
      const allowance = await contract.allowance(
        address,
        compaignFactoryAddress[chain?.id]
      );
      setUserBalance({
        balance: ethers.utils.formatEther(balance),
        allowance: ethers.utils.formatEther(allowance),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fethcUserAllowance();
  }, [address, chain]);
  console.log(userBalance, "userBalance");
  const approve = async () => {
    try {
      setLoading(true);
      const signer = walletClientToSigner(walletCl);
      const contract = new ethers.Contract(
        apeCoinAddresses[chain?.id],
        erc20ABI,
        signer
      );
      const tx = await contract.approve(
        compaignFactoryAddress[chain?.id],
        ethers.constants.MaxUint256
      );
      await tx.wait();
      await fethcUserAllowance();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="createContainer">
      <Card
        style={{
          width: "100%",
        }}
      >
        <div className="twoInputContainer">
          <div className="logoInput">
            {logoPreview ? <img src={logoPreview} /> : "Logo"}
            <FileInput
              maxSize={1}
              onChange={(file) => setLogo(file)}
              style={{
                width: "100%",
              }}
              accept="jpeg, jpg, png"
            >
              {(context) =>
                context.name ? (
                  <div
                    style={{
                      width: "100%",
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                    }}
                    onClick={context.reset}
                  >
                    <div
                      className="bannerInputButton"
                      style={{
                        backgroundColor: "blue",
                        width: "2rem",
                        height: "2rem",
                      }}
                      onClick={() => {
                        setLogo(null);
                        setLogoPreview(null);
                      }}
                    >
                      <CrossSVG
                        style={{
                          color: "#fff",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bannerInputButton">
                    <PlusSVG />
                  </div>
                )
              }
            </FileInput>
          </div>
          <div className="bannerInput">
            {bannerPreview ? <img src={bannerPreview} /> : "Banner"}
            <FileInput
              maxSize={1}
              onChange={(file) => setBanner(file)}
              style={{
                width: "100%",
              }}
            >
              {(context) =>
                context.name ? (
                  <div
                    style={{
                      width: "100%",
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                    }}
                    onClick={context.reset}
                  >
                    <div
                      className="bannerInputButton"
                      style={{
                        backgroundColor: "blue",
                        width: "2rem",
                        height: "2rem",
                      }}
                      onClick={() => {
                        setBanner(null);
                        setBannerPreview(null);
                      }}
                    >
                      <CrossSVG
                        style={{
                          color: "#fff",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bannerInputButton">
                    <PlusSVG />
                  </div>
                )
              }
            </FileInput>
          </div>
        </div>

        <div className="twoInputContainer">
          <Input
            placeholder="Enter your name"
            label="Name"
            suffix="text"
            value={createData.name}
            onChange={(e) => {
              setCreateData({ ...createData, name: e.target.value });
            }}
          />
          <Input
            placeholder="https://t.me/..."
            label="Telegram"
            suffix="text"
            value={createData.telegram}
            onChange={(e) => {
              setCreateData({ ...createData, telegram: e.target.value });
            }}
          />
        </div>

        <div className="twoInputContainer">
          <Input
            placeholder="https://twitter.com/..."
            label="Twiter"
            suffix="text"
            value={createData.twitter}
            onChange={(e) => {
              setCreateData({ ...createData, twitter: e.target.value });
            }}
          />
          <Input
            placeholder="https://..."
            label="Website"
            suffix="text"
            value={createData.website}
            onChange={(e) => {
              setCreateData({ ...createData, website: e.target.value });
            }}
          />
        </div>
        <Textarea
          label="Description"
          value={createData.descripiton}
          onChange={(e) =>
            setCreateData({ ...createData, descripiton: e.target.value })
          }
        />
        <div className="twoInputContainer">
          <Input
            placeholder="2"
            label="Minimum Buy"
            value={createData.minBuy}
            onChange={(e) => {
              setCreateData({ ...createData, minBuy: e.target.value });
            }}
            suffix="number"
          />
          <Input
            placeholder="150"
            label="Total Price"
            value={createData.totalPrice}
            onChange={(e) => {
              setCreateData({ ...createData, totalPrice: e.target.value });
            }}
            suffix="number"
          />
        </div>
        <div className="stepInptutContainer">
          <Input
            placeholder="lorem"
            label="Step"
            value={"Step 1"}
            prefix={"1"}
            disabled
          />
          <Input
            placeholder="Text..."
            label="Title"
            suffix="text"
            value={stepArray[0].title}
            onChange={(e) => {
              let copyArray = [...stepArray];
              copyArray[0].title = e.target.value;
              setStepArray(copyArray);
            }}
          />
          <Input
            placeholder="0.5..."
            label="Price"
            suffix="number"
            value={stepArray[0].price}
            onChange={(e) => {
              let copyArray = [...stepArray];
              copyArray[0].price = e.target.value;
              setStepArray(copyArray);
            }}
          />
          <Input
            placeholder="Expired Date"
            label="Date"
            suffix="Date"
            value={stepArray[0].date}
            onChange={(e) => {
              let copyArray = [...stepArray];
              copyArray[0].date = e.target.value;
              setStepArray(copyArray);
            }}
            type="Date"
          />
        </div>
        <div className="stepInptutContainer">
          <Input
            placeholder="lorem"
            label="Step"
            value={"Step 2"}
            prefix={"2"}
            disabled
          />
          <Input
            placeholder="Text..."
            label="Title"
            suffix="text"
            value={stepArray[1].title}
            onChange={(e) => {
              let copyArray = [...stepArray];
              copyArray[1].title = e.target.value;
              setStepArray(copyArray);
            }}
          />
          <Input
            placeholder="0.5..."
            label="Price"
            suffix="number"
            value={stepArray[1].price}
            onChange={(e) => {
              let copyArray = [...stepArray];
              copyArray[1].price = e.target.value;
              setStepArray(copyArray);
            }}
          />
          <Input
            placeholder="Expired Date"
            label="Date"
            suffix="Date"
            value={stepArray[1].date}
            onChange={(e) => {
              let copyArray = [...stepArray];
              copyArray[1].date = e.target.value;
              setStepArray(copyArray);
            }}
            type="Date"
          />
        </div>
        {stepArray?.map((item, index) => {
          if (index > 1) {
            return (
              <div className="stepInptutContainer">
                <Input
                  placeholder="lorem"
                  label="Step"
                  value={`Step ${index + 1}`}
                  prefix={index + 1}
                  disabled
                />
                <Input
                  placeholder="Text..."
                  label="Title"
                  suffix="text"
                  value={stepArray[index].title}
                  onChange={(e) => {
                    let copyArray = [...stepArray];
                    copyArray[index].title = e.target.value;
                    setStepArray(copyArray);
                  }}
                />
                <Input
                  placeholder="0.5..."
                  label="Price"
                  suffix="number"
                  value={stepArray[index].price}
                  onChange={(e) => {
                    let copyArray = [...stepArray];
                    copyArray[index].price = e.target.value;
                    setStepArray(copyArray);
                  }}
                />
                <Input
                  placeholder="Expired Date"
                  label="Date"
                  suffix="Date"
                  value={stepArray[index].title}
                  onChange={(e) => {
                    let copyArray = [...stepArray];
                    copyArray[index].title = e.target.value;
                    setStepArray(copyArray);
                  }}
                  type="Date"
                />
                <div
                  className="deleteStepContent"
                  onClick={() => {
                    let copyArray = [...stepArray];
                    copyArray.splice(index, 1);
                    console.log(copyArray);
                    setStepArray(copyArray);
                  }}
                >
                  <CrossSVG />
                </div>
              </div>
            );
          }
        })}
        <Button
          onClick={() =>
            setStepArray([
              ...stepArray,
              {
                title: "",
                date: "",
                price: "",
              },
            ])
          }
        >
          Add Step
        </Button>

        <Button
          disabled={loading}
          style={{
            opacity: loading && 0.5,
            cursor: loading && "progress",
          }}
          onClick={() => {
            if (userBalance?.allowance <= 0) {
              approve();
            } else {
              handleCreate();
            }
          }}
        >
          {userBalance?.allowance <= 0 ? "Approve" : "Create"}
        </Button>
      </Card>
    </div>
  );
}

export default Create;
