import React, { useState } from "react";
import "./index.css";
import {
  Input,
  MagnifyingGlassSimpleSVG,
  Select,
  EthSVG,
  Typography,
} from "@ensdomains/thorin";

//components
import PoolCard from "./components/poolCard";
function Home() {
  const [activeTab, setActiveTab] = useState(0);
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
        {[...Array(14)].map((e) => {
          return <PoolCard />;
        })}
      </div>
    </div>
  );
}

export default Home;
