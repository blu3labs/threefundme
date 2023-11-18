import React from "react";
import { Button, Card, Typography } from "@ensdomains/thorin";
import { TfiWorld } from "react-icons/tfi";
import { FaTelegramPlane } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
function PoolCard({ item, chain }) {
  const navigate = useNavigate();
  const percentage =
    (item?.totalAmount / 10 ** 18 / (item?.totalPrice / 10 ** 18)) * 100;
  return (
    <Card
      style={{
        padding: "0px",
      }}
    >
      <div className="cardContainer">
        <div className="bannerContainer">
          <img className="cardBanner" src={item?.banner} />
          <div className="cardLogo">
            <img className="cardLogo" src={item?.logo} />
            <Typography fontVariant="smallBold">{item?.name}</Typography>
          </div>
        </div>
        <div className="cardBodyContainer">
          <div className="cardBodyInfoContent">
            <Typography fontVariant="smallBold">Total Steps</Typography>
            <Typography fontVariant="small">{item?.totalSteps}</Typography>
          </div>
          <div className="cardBodyInfoContent">
            <Typography fontVariant="smallBold">Min Buy</Typography>
            <Typography fontVariant="small">
              {item?.minBuy / 10 ** 18} Ape
            </Typography>
          </div>
          <div className="cardBodyInfoContent">
            <Typography fontVariant="smallBold">Total Price</Typography>
            <Typography fontVariant="small">
              {" "}
              {item?.totalPrice / 10 ** 18} Ape
            </Typography>
          </div>
          <div className="proggressBarContainer">
            <div className="progressBar">
              <div
                className="progressBarContent"
                style={{
                  width: `${percentage}%`,
                }}
              ></div>
            </div>
            <div className="progressBarBottom">
              {item?.totalAmount / 10 ** 18} Ape
              <span>{item?.totalPrice / 10 ** 18} Ape</span>
            </div>
          </div>
        </div>
        <div className="cardFooter">
          <div className="socialMediaContainer">
            {item?.website && (
              <a href={item?.website}>
                <TfiWorld />
              </a>
            )}{" "}
            {item?.telegram && (
              <a href={item?.telegram}>
                <FaTelegramPlane />
              </a>
            )}{" "}
            {item?.twitter && (
              <a href={item?.twitter}>
                <FaSquareXTwitter />
              </a>
            )}
          </div>
          <Button
            width="20"
            style={{
              height: "30px",
            }}
            onClick={() =>
              navigate(`/details/${item?.address}?chain=${chain}`)
            }
          >
            <Typography fontVariant="extraSmall">View</Typography>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default PoolCard;
