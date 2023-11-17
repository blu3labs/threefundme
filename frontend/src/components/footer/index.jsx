import React from "react";
import "./index.css";
import { Typography } from "@ensdomains/thorin";
function Footer() {
  return (
    <div className="footerContainer">
      <div className="footerSection">
        <Typography fontVariant="extraSmall">Developed By Test</Typography>
      </div>
      <div
        className="footerSection"
        style={{
          flexDirection: "row",
        }}
      >
        <Typography fontVariant="extraSmall">ETHGlobal Istanbul</Typography>
      </div>
    </div>
  );
}

export default Footer;
