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
import sepolio from "../../../assets/sepolio.jpeg";
import axios from "axios";
function ConnectWallet() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  const { chain } = useNetwork();
  const availableChains = [534351, 11155111, 84531, 59140];
  const [isAvailable, setIsAvailable] = useState(false);
  useEffect(() => {
    if (availableChains.includes(chain?.id)) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
  }, [chain]);
  const chainsLogo = {
    534351: scrollLogo,
    11155111: sepolio,
    84531:
      "https://storage.googleapis.com/ethglobal-api-production/organizations%2Fh5ps8%2Flogo%2F1678294488367_W-9qsu1e_400x400.jpeg",
    59140:
      "https://pbs.twimg.com/profile_images/1639402103486521344/erDLnbwE_400x400.jpg",
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
