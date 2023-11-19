import React, { useEffect, useState } from "react";
import "./index.css";
import {
  Input,
  MagnifyingGlassSimpleSVG,
  Select,
  EthSVG,
  Typography,
} from "@ensdomains/thorin";
import { useNetwork, useAccount } from "wagmi";
import rpc from "../../utils/rpc.json";
import {
  compaignFactoryManagerAbi,
  compaignFactoryManagerAddress,
} from "../../contracts/compaignFactoryManager";
import { compaignAbi } from "../../contracts/compaign";
import { ethers } from "ethers";
//components
import PoolCard from "./components/poolCard";
import axios from "axios";

function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const provider = new ethers.providers.StaticJsonRpcProvider(rpc[chain?.id]);

  const [allCompaigns, setAllCompaigns] = useState();
  const [myCompaigns, setMyCompaigns] = useState();
  const fetchAllCompaings = async () => {
    try {
      const contract = new ethers.Contract(
        compaignFactoryManagerAddress[chain?.id],
        compaignFactoryManagerAbi,
        provider
      );
      let compaigns = [];
      let data = []
      if (chain?.id === 11155111) {
        // use thegraph
        /**
         * "{\n  compaignContributionReceiveds(first: 5) {\n    id\n    compaign\n    contributor\n    blockNumber\n  }\n  compaignCreateds(first: 5) {\n    id\n    compaign\n    owner\n    blockNumber\n  }\n}"

         */
       let dataPost = await axios.post("https://api.studio.thegraph.com/query/58883/threefundme/version/latest", {query:`{\n    compaignCreateds{\n    id\n    compaign\n    owner\n    blockNumber\n  }\n}
       `})

   
        
       data = dataPost.data.data.compaignCreateds.map((e) => e.compaign)
       for (let i of dataPost.data.data.compaignCreateds) {
        const contract2 = new ethers.Contract(i.compaign, compaignAbi, provider);
        const details = contract2.getCompaignInfo();
        compaigns.push(details);
      }
      } else {
       data = await contract.getAllCompaigns();

      for (let i of data) {
        const contract2 = new ethers.Contract(i, compaignAbi, provider);
        const details = contract2.getCompaignInfo();
        compaigns.push(details);
      }
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
          owner: a["compaign"]["owner"],
          totalSteps: a["allSteps"]?.length,
          allSteps: allSteps,
        });
      }
      setAllCompaigns(formatData.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllCompaings();
  }, [chain]);
  const [search, setSearch] = useState("");
  return (
    <div className="homeContainer">
      <div className="homeCardListFilterContainer">
        <Input
          icon={<MagnifyingGlassSimpleSVG />}
          placeholder="0xA0Cf…251e"
          inputMode="text"
          size="small"
          width="800px"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            if (activeTab == 0 && e.address.includes(search))
              return <PoolCard item={e} key={i} chain={chain?.id} />;
            else {
              if (e.owner == address && e.address.includes(search))
                return <PoolCard item={e} key={i} chain={chain?.id} />;
            }
          })}
      </div>
    </div>
  );
}

export default Home;
