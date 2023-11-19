import React from "react";
import "./index.css";
import { Typography, Avatar, Card, Profile } from "@ensdomains/thorin";
import ConnectWallet from "./connectWallet";
import { NavLink } from "react-router-dom";
function Header() {
  return (
    <div className="headerContainer">
      <NavLink to="/">
        <Typography fontVariant="extraLargeBold">ThreeFundMe</Typography>
      </NavLink>

      <div className="headerMenuContainer">
        <NavLink to="/">
          <Typography fontVariant="large">
            <div
              style={{
                cursor: "pointer",
              }}
            >
              List
            </div>
          </Typography>
        </NavLink>
        <NavLink to="/create">
          <Typography fontVariant="large">
            <div
              style={{
                cursor: "pointer",
              }}
            >
              Create
            </div>
          </Typography>
        </NavLink>
      </div>
      <div className="headerConnectContainer">
        <ConnectWallet />
      </div>
    </div>
  );
}

export default Header;
