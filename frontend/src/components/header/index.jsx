import React from "react";
import "./index.css";
import { Typography, Avatar, Card, Profile } from "@ensdomains/thorin";
import ConnectWallet from "./connectWallet";
function Header() {
  return (
    <div className="headerContainer">
      <Typography fontVariant="extraLargeBold">Name</Typography>

      <div className="headerMenuContainer">
        <Typography fontVariant="large">
          <div
            style={{
              cursor: "pointer",
            }}
          >
            List
          </div>
        </Typography>
        <Typography fontVariant="large">
          <div
            style={{
              cursor: "pointer",
            }}
          >
            Create
          </div>
        </Typography>
      </div>
      <div className="headerConnectContainer">
        <ConnectWallet />
      </div>
    </div>
  );
}

export default Header;
