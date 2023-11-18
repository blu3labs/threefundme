import React, { useEffect, useState } from "react";
import "./index.css";
import {
  Input,
  MagnifyingGlassSimpleSVG,
  Select,
  EthSVG,
  Typography,
} from "@ensdomains/thorin";
import { useNetwork } from "wagmi";
import rpc from "../../utils/rpc.json";
import {
  compaignFactoryManagerAbi,
  compaignFactoryManagerAddress,
} from "../../contracts/compaignFactoryManager";
import { compaignAbi } from "../../contracts/compaign";
import { ethers } from "ethers";
//components
import PoolCard from "./components/poolCard";

function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const { chain } = useNetwork();
  const provider = new ethers.providers.StaticJsonRpcProvider(rpc[chain?.id]);

  const [allCompaigns, setAllCompaigns] = useState();
  const fetchAllCompaings = async () => {
    try {
      const contract = new ethers.Contract(
        compaignFactoryManagerAddress[chain?.id],
        compaignFactoryManagerAbi,
        provider
      );
      const data = await contract.getAllCompaigns();
      let compaigns = [];
      for (let i of data) {
        const contract2 = new ethers.Contract(i, compaignAbi, provider);
        const details = contract2.getCompaignInfo();
        compaigns.push(details);
      }
      const allCompaigns = await Promise.all(compaigns);
      console.log(allCompaigns, "data");
      const formatData = [];
      for (let i in allCompaigns) {
        const a = allCompaigns[i];
        let allSteps = [];
        for (let steps of a["allSteps"]) {
          allSteps.push({
            collected: steps["collected"],
            currentAmount: steps["currentAmount"]?.toString(),
            expireTime: steps["expireTime"]?.toString(),
            stepId: steps["stepId"]?.toString(),
          });
        }
        formatData.push({
          address: data[i],
          id: a["id"],
          totalAmount: a["totalAmount"]?.toString(),
          statusCompaign: a["statusCompaign"],
          currentStatus: a["currentStatus"]?.toString(),
          name: a["compaign"]["details"][0],
          telegram: a["compaign"]["details"][1],
          twitter: a["compaign"]["details"][2],
          website: a["compaign"]["details"][3],
          description: a["compaign"]["details"][4],
          logo: a["compaign"]["details"][5],
          banner: a["compaign"]["details"][6],
          minBuy: a["compaign"]["numericDetails"][0]?.toString(),
          totalPrice: a["compaign"]["numericDetails"][1]?.toString(),
          totalSteps: a["allSteps"]?.length,
          allSteps: allSteps,
        });
      }
      console.log(formatData, "formatData");
      setAllCompaigns(formatData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllCompaings();
  }, [chain]);
  return (
    <div className="homeContainer">
      <div className="homeCardListFilterContainer">
        <Input
          icon={<MagnifyingGlassSimpleSVG />}
          placeholder="0xA0Cf…251e"
          inputMode="text"
          size="small"
          width="800px"
        />
        <div className="foundTypeContainer">
          <div
            className={activeTab == 0 ? "foundTypeActive" : "foundType"}
            onClick={() => setActiveTab(0)}
          >
            <Typography>All</Typography>
          </div>
          <div
            className={activeTab == 1 ? "foundTypeActive" : "foundType"}
            onClick={() => setActiveTab(1)}
          >
            <Typography>My</Typography>
          </div>
        </div>
      </div>
      <div className="homeCardListContainer">
        {allCompaigns &&
          allCompaigns?.map((e, i) => {
            return <PoolCard item={e} key={i} chain={chain?.id} />;
          })}
      </div>
    </div>
  );
}

export default Home;
