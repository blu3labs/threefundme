import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  LockSVG,
  Profile,
  Typography,
} from "@ensdomains/thorin";
import { Core } from "@walletconnect/core";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useNetwork, useEnsName } from "wagmi";
import scrollLogo from "../../../assets/scrollLogo.jpeg";
import axios from "axios";
function ConnectWallet() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  const { chain } = useNetwork();
  const availableChains = [97, 534352, 11155111];
  const [isAvailable, setIsAvailable] = useState(false);
  useEffect(() => {
    if (availableChains.includes(chain?.id)) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
  }, [chain]);
  const chainsLogo = {
    97: "https://logowik.com/content/uploads/images/binance-smart-chain3412.logowik.com.webp",
    534352: scrollLogo,
    534353: scrollLogo,
    11155111:
      "https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png",
  };
  const { data } = useEnsName({
    address: address,
  });
  console.log(data, "ens name");

  const fethcEnsName = async () => {
    if (address) {
    }
  };
  useEffect(() => {
    fethcEnsName();
  }, [address, chain]);
  return (
    <div>
      {address ? (
        isAvailable ? (
          <div className="connectedUserCard">
            <div
              style={{
                width: "32px",
                cursor: "pointer",
              }}
              onClick={() => open({ view: "Networks" })}
            >
              <Avatar src={chainsLogo[chain?.id]} />
            </div>
            <Typography
              style={{
                cursor: "pointer",
              }}
              onClick={() => open({ view: "Account" })}
            >
              {data ? data : address.slice(0, 4) + "..." + address.slice(-4)}
            </Typography>
          </div>
        ) : (
          <div style={{ width: "200px" }}>
            <Button
              variant="red"
              onClick={() => open({ view: "Networks" })}
              style={{ height: "2rem" }}
            >
              Wrong Network
            </Button>
          </div>
        )
      ) : (
        <div style={{ width: "180px" }}>
          <Button
            prefix={<LockSVG />}
            variant="primary"
            onClick={() => open()}
            style={{ height: "2rem" }}
          >
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
