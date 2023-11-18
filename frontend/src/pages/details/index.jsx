import React, { useEffect, useState } from "react";
import "./index.css";
import {
  Card,
  Typography,
  ScrollBox,
  PersonSVG,
  Button,
  Modal,
  Input,
  Textarea,
  FileInput,
  VisuallyHidden,
  CrossSVG,
} from "@ensdomains/thorin";
import { TfiWorld } from "react-icons/tfi";
import { FaTelegramPlane } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import PostCard from "./components/postCard";
import ChatCard from "./components/chatCard";
import { IoChatbubble } from "react-icons/io5";
import Countdown from "react-countdown";
import moment from "moment";
import {
  useNetwork,
  useAccount,
  useWalletClient,
  useSwitchNetwork,
  erc20ABI,
} from "wagmi";
import { ethers } from "ethers";
import { walletClientToSigner } from "../../utils/walletConnectToSigner";
import { writeContract } from "../../utils/writeContract";
import { compaignAbi } from "../../contracts/compaign";
import { addFile } from "../../utils/addFileHook";
import protobuf from "protobufjs";
import {
  createLightNode,
  waitForRemotePeer,
  createDecoder,
  bytesToUtf8,
  createRelayNode,
  Protocols,
  createEncoder,
} from "@waku/sdk";
import rpc from "../../utils/rpc.json";
import { v4 as uuid, v4 } from "uuid";
import { bootstrap } from "@libp2p/bootstrap";
import { wakuDnsDiscovery } from "@waku/dns-discovery";
import { apeCoinAddresses } from "../../contracts/ape";

function Details() {
  const compaignAddress = window.location.pathname.split("details/")[1];
  const compaignChainId = window.location.search.split("=")[1];
  const provider = new ethers.providers.StaticJsonRpcProvider(
    rpc[compaignChainId]
  );
  const [userBalance, setUserBalance] = useState();
  const fethcUserAllowance = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpc[chain?.id]);
      const contract = new ethers.Contract(
        apeCoinAddresses[chain?.id],
        erc20ABI,
        provider
      );
      const balance = await contract.balanceOf(address);
      const allowance = await contract.allowance(address, compaignAddress);
      setUserBalance({
        balance: ethers.utils.formatEther(balance),
        allowance: ethers.utils.formatEther(allowance),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const [contributeLoading, setContributeLoading] = useState(false);
  const approve = async () => {
    try {
      setContributeLoading(true);
      const signer = walletClientToSigner(walletCl);
      const contract = new ethers.Contract(
        apeCoinAddresses[chain?.id],
        erc20ABI,
        signer
      );
      const tx = await contract.approve(
        compaignAddress,
        ethers.constants.MaxUint256
      );
      await fethcUserAllowance();
      setContributeLoading(false);
    } catch (error) {
      setContributeLoading(false);
      console.log(error);
    }
  };
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: walletCl } = useWalletClient();
  const { switchNetworkAsync } = useSwitchNetwork();
  const [amount, setAmount] = useState();
  const [details, setDetails] = useState();
  const fetchCompaign = async () => {
    try {
      const contract = new ethers.Contract(
        compaignAddress,
        compaignAbi,
        provider
      );
      const start = new Date().getTime();
      const compaignDetails = await contract.getCompaignInfo();

      let allSteps = [];
      let posts = [];
      let stepsPosts = [];
      for (let steps of compaignDetails["allSteps"]) {
        for (let post of steps["posts"]) {
          posts.push({
            step: steps["stepId"]?.toString(),
            img: post["details"][0],
            title: post["details"][1],
            desc: post["details"][2],
            date: moment(
              new Date(post["timestamp"]?.toString() * 1000).getTime()
            ).format("DD/MM/YYYY HH:mm"),
          });
        }
        allSteps.push({
          collected: steps["collected"],
          currentAmount: steps["currentAmount"]?.toString(),
          expireTime: steps["expireTime"]?.toString(),
          stepId: steps["stepId"]?.toString(),
        });
        stepsPosts.push({
          step: steps["stepId"]?.toString(),
          count: steps["posts"]?.length,
        });
      }
      setDetails({
        posts: posts,
        stepsPosts: stepsPosts,
        address: compaignAddress,
        id: compaignDetails["id"],
        totalAmount: compaignDetails["totalAmount"]?.toString(),
        statusCompaign: compaignDetails["statusCompaign"],
        currentStatus: compaignDetails["currentStatus"]?.toString(),
        name: compaignDetails["compaign"]["details"][0],
        telegram: compaignDetails["compaign"]["details"][1],
        twitter: compaignDetails["compaign"]["details"][2],
        website: compaignDetails["compaign"]["details"][3],
        description: compaignDetails["compaign"]["details"][4],
        logo: compaignDetails["compaign"]["details"][5],
        banner: compaignDetails["compaign"]["details"][6],
        minBuy: compaignDetails["compaign"]["numericDetails"][0]?.toString(),
        totalPrice:
          compaignDetails["compaign"]["numericDetails"][1]?.toString(),
        totalSteps: compaignDetails["allSteps"]?.length,
        allSteps: allSteps,
        owner: compaignDetails["compaign"]["owner"],
      });

      await hasContribute(compaignDetails["currentStatus"]);
    } catch (error) {
      console.log(error);
    }
  };
  const [isContribute, setisContribute] = useState(false);
  const hasContribute = async (id) => {
    try {
      const contract = new ethers.Contract(
        compaignAddress,
        compaignAbi,
        provider
      );
      const tx = await contract.hasContribute(address, id);
      setisContribute(tx);
      console.log(tx, "hasContribute");
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    fetchCompaign();
    fethcUserAllowance();
    let interval = setInterval(() => {
      fetchCompaign();
      fethcUserAllowance();
    }, 7000);
    return () => clearInterval(interval);
  }, [compaignAddress]);
  let id = "0xdsqdsdsqdqdsd";

  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState();
  const [filePreview, setFilePreview] = useState();
  const [chatOpen, setChatOpen] = useState(false);
  const convertPreview = () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };
  useEffect(() => {
    convertPreview();
  }, [file]);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const handleOwnerFunctions = async (method) => {
    try {
      setOwnerLoading(true);
      const signer = walletClientToSigner(walletCl);
      const tx = await writeContract({
        signer: signer,
        address: compaignAddress,
        abi: compaignAbi,
        method: method,
        switchNetworkAsync: switchNetworkAsync,
      });
      await tx.wait();
      setOwnerLoading(false);
    } catch (error) {
      console.log(error);
      setOwnerLoading(false);
    }
  };
  const handleContribute = async () => {
    try {
      console.log("girdi mi")
      setContributeLoading(true);
      const signer = walletClientToSigner(walletCl);
      const tx = await writeContract({
        signer: signer,
        address: compaignAddress,
        abi: compaignAbi,
        method: "contribute",
        args: [ethers.utils.parseEther(amount?.toString() || "0")],
        switchNetworkAsync: switchNetworkAsync,
      });
      await tx.wait();
      setContributeLoading(false);
    } catch (error) {
      setContributeLoading(false);
      console.log(error);
    }
  };
  console.log(contributeLoading,"contributeloading")
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const handleWithdraw = async () => {
    try {
      setWithdrawLoading(true);
      const signer = walletClientToSigner(walletCl);
      const tx = await writeContract({
        signer: signer,
        address: compaignAddress,
        abi: compaignAbi,
        method: "withdraw",
        switchNetworkAsync: switchNetworkAsync,
      });
      await tx.wait();

      setWithdrawLoading(false);
    } catch (error) {
      console.log(error);
      setWithdrawLoading(false);
    }
  };
  const [postData, setPostData] = useState({
    title: "",
    description: "",
  });
  const [postLoading, setPostLoading] = useState(false);
  const makePost = async () => {
    try {
      setPostLoading(true);
      const fileUrl = await addFile(file);
      const signer = walletClientToSigner(walletCl);
      const tx = await writeContract({
        signer: signer,
        address: compaignAddress,
        abi: compaignAbi,
        method: "makePost",
        args: [
          details?.currentStatus,
          [fileUrl, postData.title, postData.description],
        ],
        switchNetworkAsync: switchNetworkAsync,
      });
      await tx.wait();

      setModalOpen(false);
      setPostLoading(false);
    } catch (error) {
      console.log(error);
      setPostLoading(false);
    }
  };

  const AddPostModal = () => {
    return (
      <Modal open={modalOpen == true} onDismiss={() => setModalOpen(false)}>
        <Card
          style={{
            opacity: "1 !important",
            width: "600px",
          }}
          title="Add Post"
        >
          {filePreview && (
            <img
              src={filePreview}
              style={{
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          )}
          <FileInput maxSize={1} onChange={(file) => setFile(file)}>
            {(context) =>
              context.name ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                  onClick={context.reset}
                >
                  {context.name}
                  <div
                    style={{
                      height: "16px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                    }}
                  >
                    <CrossSVG />
                  </div>
                </div>
              ) : (
                <div className="fileInputContent">
                  Image, Video
                  <div className="fileInput">
                    <Typography
                      style={{
                        color: "#9B9BA6",
                        width: "100%",
                        cursor: "pointer",
                      }}
                    >
                      {context.droppable ? "Drop file" : "Attach file"}
                    </Typography>
                    <div className="inputType">File</div>
                  </div>
                </div>
              )
            }
          </FileInput>
          <Input
            label="Title"
            placeholder="Lorem Ipsum"
            suffix="Text"
            value={postData.title}
            onChange={(e) =>
              setPostData({ ...postData, title: e.target.value })
            }
          />
          <Textarea
            label="Description"
            placeholder="Share your story…"
            value={postData.description}
            onChange={(e) =>
              setPostData({ ...postData, description: e.target.value })
            }
          />
          <Button
            style={{
              height: "2rem",
              opacity: postLoading && "0.5",
              cursor: postLoading && "progress",
            }}
            disabled={postLoading}
            onClick={() => makePost()}
          >
            Save
          </Button>
        </Card>
      </Modal>
    );
  };

  // chat mechanism => Waku protocol

  const contentTopic = "/threefundme/3/compaign/chat/" + id;

  const encoder = createEncoder({ contentTopic });
  const decoder = createDecoder(contentTopic);

  const ProtoChatMessage = new protobuf.Type("ChatMessage")
    .add(new protobuf.Field("id", 1, "string"))
    .add(new protobuf.Field("timestamp", 2, "uint64"))
    .add(new protobuf.Field("address", 3, "string"))
    .add(new protobuf.Field("text", 4, "string"));

  const [waku, setWaku] = React.useState(undefined);
  const [wakuStatus, setWakuStatus] = React.useState("None");
  const [messagesChat, setMessages] = React.useState([]);
  const [chatContent, setChatContent] = React.useState("");
  useEffect(() => {
    setWakuStatus("Starting");

    // Define DNS node list

    createLightNode({
      defaultBootstrap: true,
    })
      .then((waku) => {
        waku.start().then(() => {
          setWaku(waku);

          setWakuStatus("Connecting");
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!waku) return;

    // We do not handle disconnection/re-connection in this example
    if (wakuStatus === "Connected") return;

    waitForRemotePeer(waku, [Protocols.LightPush, Protocols.Store])
      .then(() => {
        // We are now connected to a store node
        setWakuStatus("Connected");
      })
      .catch((err) => {
        console.log("error waiting peer", err);
      });
  }, [wakuStatus, waku]);

  function decodeMessage(wakuMessage) {
    if (!wakuMessage.payload) return;

    const { id, timestamp, address, text } = ProtoChatMessage.decode(
      wakuMessage.payload
    );

    if (!timestamp || !text || !address || !id) return;

    const time = new Date();
    time.setTime(Number(timestamp));

    return {
      text: text,
      id,
      timestamp,
      address,
      timestampInt: wakuMessage.timestamp,
    };
  }

  const updateMessages = async () => {
    const startTime = new Date();

    // should be timestamp of compaign
    startTime.setTime(1700218136000);

    try {
      for await (const messagesPromises of waku.store.queryGenerator(
        [decoder],
        {
          timeFilter: { startTime, endTime: new Date() },
          pageDirection: "backward",
        }
      )) {
        let messages = await Promise.all(
          messagesPromises.map(async (p) => {
            const msg = await p;

            let decoded = decodeMessage(msg);
            if (!decoded) {
              return;
            }
            return decoded;
          })
        );

        // filter by unique id.
        let messagesOfficial = [];
        messages = messages.concat(messagesChat);
        messages.forEach((e) => {
          if (
            messagesOfficial.filter((v) => v.id === e.id).length === 0 &&
            e.id !== "109156be-c4fb-41ea-b1b4-efe1671c5836"
          ) {
            messagesOfficial.push(e);
          }
        });
        if (messagesOfficial.length <= 0) return;

        messagesOfficial = messagesOfficial.sort((a, b) => {
          return a.timestamp > b.timestamp ? 1 : -1;
        });

        setMessages(messagesOfficial);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (wakuStatus !== "Connected") return;

    setInterval(async () => {
      await updateMessages();
    }, 2000);
    updateMessages();
  }, [wakuStatus]);

  const sendMessage = async (text) => {
    if (!waku) return;

    const timestamp = new Date().getTime();
    const message = {
      timestamp,
      address,
      id: v4(),
      text: text,
    };
    const createMessage = ProtoChatMessage.create(message);
    const encoded = ProtoChatMessage.encode(createMessage).finish();

    let tx = await waku.lightPush.send(encoder, {
      payload: encoded,
    });

    await updateMessages();
    setChatContent("");
  };
  const percentage =
    (details?.totalAmount / 10 ** 18 / (details?.totalPrice / 10 ** 18)) * 100;
  return (
    <div className="detailsWrapper">
      {modalOpen && AddPostModal()}
      {details && details?.owner == address && (
        <Card
          style={{
            width: "100%",
            padding: "1rem",
          }}
        >
          <div className="ownerZoneContainer">
            <Button
              style={{
                height: "2rem",
                opacity: ownerLoading && "0.5",
                cursor: ownerLoading && "progress",
              }}
              disabled={ownerLoading}
              onClick={() => handleOwnerFunctions("switchStep")}
            >
              Next Step
            </Button>
            <Button
              style={{
                height: "2rem",
              }}
              onClick={() => setModalOpen(true)}
            >
              Add Post
            </Button>
            <Button
              style={{
                height: "2rem",
                opacity: ownerLoading && "0.5",
                cursor: ownerLoading && "progress",
              }}
              disabled={ownerLoading}
              onClick={() => handleOwnerFunctions("collectTokens")}
            >
              Collect Tokens
            </Button>
            {/* <Button
              style={{
                height: "2rem",
              }}
            >
              Edit(maybe)
            </Button> */}
          </div>
        </Card>
      )}
      <div className="detailsContainer">
        <div className="detailspProjectInfoContainer">
          <Card
            style={{
              width: "100%",
              padding: "1rem",
            }}
          >
            <img className="fundDetialsBanner" src={details?.banner} />
            <div className="fundNameContainer">
              <img src={details?.logo} className="fundDetailsLogo" />
              <div className="socialMediaName">
                <Typography fontVariant="largeBold">{details?.name}</Typography>
                <div className="socialMediaContainer">
                  {details?.website && (
                    <a href={details?.website}>
                      <TfiWorld />
                    </a>
                  )}{" "}
                  {details?.telegram && (
                    <a href={details?.telegram}>
                      <FaTelegramPlane />
                    </a>
                  )}{" "}
                  {details?.twitter && (
                    <a href={details?.twitter}>
                      <FaSquareXTwitter />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <ScrollBox style={{ height: "150px" }}>
              <Typography fontVariant="small">
                {details?.description}
              </Typography>
            </ScrollBox>
            <div className="fundInfoContent">
              <Typography fontVariant="smallBold">Min Buy</Typography>
              <Typography fontVariant="small">
                {details?.minBuy / 10 ** 18} APE
              </Typography>
            </div>

            <div className="fundInfoContent">
              <Typography fontVariant="smallBold">
                Total Contributions
              </Typography>
              <Typography fontVariant="small">
                {details?.totalAmount / 10 ** 18} APE
              </Typography>
            </div>
            <div className="fundInfoContent">
              <Typography fontVariant="smallBold">Active Steps</Typography>
              <Typography fontVariant="small">
                {Number(details?.currentStatus) + 1}
              </Typography>
            </div>
            <div className="fundInfoContent">
              <Typography fontVariant="smallBold">
                Active Steps Countdown
              </Typography>
              <Typography fontVariant="small">
                {details && (
                  <>
                    <Countdown
                      date={
                        details?.allSteps[details?.currentStatus]?.expireTime *
                        1000
                      }
                    />
                  </>
                )}
              </Typography>
            </div>

            <div className="progressBarContainer">
              <div className="progressBar">
                <div
                  className="progressBarContent"
                  style={{
                    width: `${percentage}%`,
                  }}
                ></div>
              </div>
              <div className="progressBarBottom">
                {details?.totalAmount / 10 ** 18} Ape
                <span>{details?.totalPrice / 10 ** 18} Ape</span>
              </div>
            </div>
          </Card>
          <Card
            style={{
              width: "100%",
              padding: "1rem",
            }}
          >
            <Input
              label="Amount"
              placeholder="0.5 APE"
              suffix="Number"
              type="Number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onWheel={() => document.activeElement.blur()}
            />
            <Button
              style={{
                height: "2rem",
                opacity: contributeLoading && "0.5",
                cursor: contributeLoading && "progress",
              }}
              disabled={contributeLoading}
              onClick={() => {
                if (userBalance?.allowance <= 0) {
                  approve();
                } else {
                  handleContribute();
                }
              }}
            >
              {userBalance?.allowance <= 0 ? "Approve" : "Contribute"}
            </Button>
            <Button
              style={{
                height: "2rem",
                opacity: withdrawLoading && "0.5",
                cursor: withdrawLoading && "progress",
              }}
              disabled={withdrawLoading}
              onClick={() => handleWithdraw()}
            >
              withdraw
            </Button>
          </Card>
        </div>
        <div className="detailspProjectPostContainer">
          <div className="detailsProjectPosts">
            {details &&
              details?.posts?.map((e, key) => {
                return <PostCard item={e} key={key} />;
              })}
          </div>
          <div className="detailsProjectPostsStepBar">
            {details &&
              details?.stepsPosts?.map((e, key) => {
                if (e.count > 0) {
                  return (
                    <div
                      key={key}
                      className="detailsProjectPostsSteps"
                      style={{
                        height: `${e.count * 365}px`,
                      }}
                    >
                      <div className="stepText">
                        <Typography fontVariant="smallBold">
                          {e.step}
                        </Typography>
                      </div>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
      {isContribute && (
        <div className="chatContainer">
          {chatOpen ? (
            <ChatCard
              details={details}
              setChatOpen={setChatOpen}
              onSendMessage={sendMessage}
              chatContent={chatContent}
              setChatContent={setChatContent}
              messages={messagesChat}
            />
          ) : (
            <div className="chatOpenButton" onClick={() => setChatOpen(true)}>
              <IoChatbubble />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Details;
