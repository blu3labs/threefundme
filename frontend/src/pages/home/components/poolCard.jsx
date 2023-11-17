import React from "react";
import { Button, Card, Typography } from "@ensdomains/thorin";
import { TfiWorld } from "react-icons/tfi";
import { FaTelegramPlane } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

function PoolCard() {
  return (
    <Card
      style={{
        padding: "0px",
      }}
    >
      <div className="cardContainer">
        <div className="bannerContainer">
          <img
            className="cardBanner"
            src="https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp"
          />
          <div className="cardLogo">
            <img
              className="cardLogo"
              src="https://sm.mashable.com/mashable_tr/photo/default/musk-kitap_vfeq.jpg"
            />
            <Typography fontVariant="smallBold">Test</Typography>
          </div>
        </div>
        <div className="cardBodyContainer">
          <div className="cardBodyInfoContent">
            <Typography fontVariant="smallBold">Total Steps</Typography>
            <Typography fontVariant="small">1</Typography>
          </div>
          <div className="cardBodyInfoContent">
            <Typography fontVariant="smallBold">Min Buy</Typography>
            <Typography fontVariant="small">1 Ape</Typography>
          </div>
          <div className="cardBodyInfoContent">
            <Typography fontVariant="smallBold">Soft Cap</Typography>
            <Typography fontVariant="small">1000 Ape</Typography>
          </div>
          <div className="cardBodyInfoContent">
            <Typography fontVariant="smallBold">Participants</Typography>
            <Typography fontVariant="small">120</Typography>
          </div>
          <div className="proggressBarContainer">
            <div className="progressBar">
              <div
                className="progressBarContent"
                style={{
                  width: `${50}%`,
                }}
              ></div>
            </div>
            <div className="progressBarBottom">
              0 Ape
              <span>100 Ape</span>
            </div>
          </div>
        </div>
        <div className="cardFooter">
          <div className="socialMediaContainer">
            <TfiWorld />
            <FaTelegramPlane />
            <FaSquareXTwitter />
          </div>
          <Button
            width="20"
            style={{
              height: "30px",
            }}
          >
            <Typography fontVariant="extraSmall">View</Typography>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default PoolCard;
