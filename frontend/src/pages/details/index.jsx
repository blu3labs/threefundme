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
import {
  useNetwork,
  useAccount,
  useWalletClient,
  useSwitchNetwork,
} from "wagmi";
import { ethers } from "ethers";
import { walletClientToSigner } from "../../utils/walletConnectToSigner";
import { writeContract } from "../../utils/writeContract";
import { compaignAbi } from "../../contracts/compaign";
import { addFile } from "../../utils/addFileHook";
function Details() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: walletCl } = useWalletClient();
  const { switchNetworkAsync } = useSwitchNetwork();
  const [amount, setAmount] = useState();
  const dummyArray = [
    {
      step: "1",
      title: "Project Started",
      date: "15/03/2023 15:35",
      img: "https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum voluptatum provident harum non modi iure necessitatibus omnis id nesciunt molestias suscipit minus reprehenderit, dicta tenetur nulla doloribus natus ab ducimus itaque dolores accusamus facere fugit sit. Delectus molestias praesentium itaque consectetur fugiat, et temporibus ipsam omnis quidem provident dolor quos",
    },
    {
      step: "1",
      title: "Project Started",
      date: "15/03/2023 15:35",
      img: "https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum voluptatum provident harum non modi iure necessitatibus omnis id nesciunt molestias suscipit minus reprehenderit, dicta tenetur nulla doloribus natus ab ducimus itaque dolores accusamus facere fugit sit. Delectus molestias praesentium itaque consectetur fugiat, et temporibus ipsam omnis quidem provident dolor quos",
    },
    {
      step: "1",
      title: "Project Started",
      date: "15/03/2023 15:35",
      img: "https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum voluptatum provident harum non modi iure necessitatibus omnis id nesciunt molestias suscipit minus reprehenderit, dicta tenetur nulla doloribus natus ab ducimus itaque dolores accusamus facere fugit sit. Delectus molestias praesentium itaque consectetur fugiat, et temporibus ipsam omnis quidem provident dolor quos",
    },
    {
      step: "2",
      title: "Project Started",
      date: "15/03/2023 15:35",
      img: "https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum voluptatum provident harum non modi iure necessitatibus omnis id nesciunt molestias suscipit minus reprehenderit, dicta tenetur nulla doloribus natus ab ducimus itaque dolores accusamus facere fugit sit. Delectus molestias praesentium itaque consectetur fugiat, et temporibus ipsam omnis quidem provident dolor quos",
    },
    {
      step: "2",
      title: "Project Started",
      date: "15/03/2023 15:35",
      img: "https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum voluptatum provident harum non modi iure necessitatibus omnis id nesciunt molestias suscipit minus reprehenderit, dicta tenetur nulla doloribus natus ab ducimus itaque dolores accusamus facere fugit sit. Delectus molestias praesentium itaque consectetur fugiat, et temporibus ipsam omnis quidem provident dolor quos",
    },
    {
      step: "2",
      title: "Project Started",
      date: "15/03/2023 15:35",
      img: "https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum voluptatum provident harum non modi iure necessitatibus omnis id nesciunt molestias suscipit minus reprehenderit, dicta tenetur nulla doloribus natus ab ducimus itaque dolores accusamus facere fugit sit. Delectus molestias praesentium itaque consectetur fugiat, et temporibus ipsam omnis quidem provident dolor quos",
    },
    {
      step: "3",
      title: "Project Started",
      date: "15/03/2023 15:35",
      img: "https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum voluptatum provident harum non modi iure necessitatibus omnis id nesciunt molestias suscipit minus reprehenderit, dicta tenetur nulla doloribus natus ab ducimus itaque dolores accusamus facere fugit sit. Delectus molestias praesentium itaque consectetur fugiat, et temporibus ipsam omnis quidem provident dolor quos",
    },
    {
      step: "4",
      title: "Project Started",
      date: "15/03/2023 15:35",
      img: "https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp",
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum voluptatum provident harum non modi iure necessitatibus omnis id nesciunt molestias suscipit minus reprehenderit, dicta tenetur nulla doloribus natus ab ducimus itaque dolores accusamus facere fugit sit. Delectus molestias praesentium itaque consectetur fugiat, et temporibus ipsam omnis quidem provident dolor quos",
    },
  ];

  const PostSteps = [
    {
      step: "1",
      count: 3,
    },
    {
      step: "2",
      count: 3,
    },
    {
      step: "3",
      count: 1,
    },
    {
      step: "4",
      count: 1,
    },
  ];

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

  const handleOwnerFunctions = async (method) => {
    try {
      const signer = walletClientToSigner(walletCl);
      const tx = await writeContract({
        signer: signer,
        address: "",
        abi: compaignAbi,
        method: method,
        switchNetworkAsync: switchNetworkAsync,
      });
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };
  const handleContribute = async () => {
    try {
      const signer = walletClientToSigner(walletCl);
      const tx = await writeContract({
        signer: signer,
        address: "",
        abi: compaignAbi,
        method: "contribute",
        args: [ethers.utils.parseEther(amount?.toString())],
        switchNetworkAsync: switchNetworkAsync,
      });
      console.log(tx);
    } catch (error) {
      console.log(amount);
    }
  };

  const handleWithdraw = async () => {
    try {
      const signer = walletClientToSigner(walletCl);
      const tx = await writeContract({
        signer: signer,
        address: "",
        abi: compaignAbi,
        method: "withdraw",
        switchNetworkAsync: switchNetworkAsync,
      });
      console.log(tx);
    } catch (error) {
      console.log(amount);
    }
  };
  const [postData, setPostData] = useState({
    title: "",
    description: "",
  });
  const makePost = async () => {
    try {
      const fileUrl = await addFile(file);
      const signer = walletClientToSigner(walletCl);
      const tx = await writeContract({
        signer: signer,
        address: "",
        abi: compaignAbi,
        method: "makePost",
        args: ["1", [fileUrl, postData.title, postData.description]],
        switchNetworkAsync: switchNetworkAsync,
      });
      console.log(tx);
    } catch (error) {
      console.log(error);
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
          <img src={filePreview} />
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
            }}
            onClick={() => makePost()}
          >
            Save
          </Button>
        </Card>
      </Modal>
    );
  };

  return (
    <div className="detailsWrapper">
      {modalOpen && AddPostModal()}

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
            }}
            onClick={() => setToast(true)}
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
            }}
          >
            Cancel
          </Button>
          <Button
            style={{
              height: "2rem",
            }}
          >
            Edit(maybe)
          </Button>
        </div>
      </Card>
      <div className="detailsContainer">
        <div className="detailspProjectInfoContainer">
          <Card
            style={{
              width: "100%",
              padding: "1rem",
            }}
          >
            <img
              className="fundDetialsBanner"
              src="https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp"
            />
            <div className="fundNameContainer">
              <img
                src="https://sm.mashable.com/mashable_tr/photo/default/musk-kitap_vfeq.jpg"
                className="fundDetailsLogo"
              />
              <div className="socialMediaName">
                <Typography fontVariant="largeBold">Elon Musk</Typography>
                <div className="socialMediaContainer">
                  <TfiWorld />
                  <FaTelegramPlane />
                  <FaSquareXTwitter />
                </div>
              </div>
            </div>
            <ScrollBox style={{ height: "150px" }}>
              <Typography fontVariant="small">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repudiandae laboriosam soluta in. Doloribus fugit veniam ratione
                suscipit officia ipsam ullam explicabo ipsum quod possimus,
                laudantium assumenda aliquid accusamus molestiae, sint nisi.
                Odio, eveniet voluptate minus eum porro animi quam neque vitae.
                Repellendus, quasi! Amet facere vel sapiente inventore,
                doloribus aut repellat. Ducimus obcaecati reiciendis labore.
                Explicabo dolores obcaecati ab fugit velit vel dolorum vitae
                voluptatibus consectetur, quia esse veniam accusantium soluta
                sint laboriosam. Ipsam culpa quibusdam impedit, soluta
                voluptatem, eius ut iste deleniti sequi repellendus itaque
                perferendis. Ipsa nulla cum accusamus consequuntur in,
                reiciendis aperiam possimus dolorem odio, omnis doloremque
                necessitatibus incidunt quasi vitae tempore est error optio amet
                tenetur debitis. Vel provident accusantium illo ducimus veniam.
                Eos quae nam reprehenderit, laboriosam aliquid consectetur earum
                est ipsum ipsam exercitationem temporibus totam quia reiciendis
                dolores ducimus! Expedita qui repudiandae explicabo laudantium
                non quisquam esse, quam, eum labore, impedit deleniti odit
                recusandae voluptatibus quibusdam cumque. Reprehenderit tempore
                itaque quo molestiae corporis quam. Rerum aspernatur vitae
                libero iusto magni a repellendus animi non aliquam quia
                quibusdam deleniti temporibus, necessitatibus qui ducimus enim
                recusandae! Est, aliquam maxime deserunt, distinctio quas
                impedit repudiandae culpa praesentium placeat veniam odit illum
                numquam nostrum! Porro eum, ut ratione aut accusamus quasi
                itaque iste asperiores distinctio nesciunt magnam commodi
                tenetur temporibus. Necessitatibus et officiis nisi at
                temporibus nulla ratione ea explicabo, fugit, quisquam ullam
                suscipit earum ipsum unde sequi nobis laudantium ut, nihil
                libero sunt! Quae, saepe suscipit cumque dolores quidem harum
                praesentium in error iure laboriosam natus rem!
              </Typography>
            </ScrollBox>
            <div className="fundInfoContent">
              <Typography fontVariant="smallBold">Min Buy</Typography>
              <Typography fontVariant="small">1 APE</Typography>
            </div>

            <div className="fundInfoContent">
              <Typography fontVariant="smallBold">
                Total Contributions
              </Typography>
              <Typography fontVariant="small">50 APE</Typography>
            </div>
            <div className="fundInfoContent">
              <Typography fontVariant="smallBold">Active Steps</Typography>
              <Typography fontVariant="small">1</Typography>
            </div>
            <div className="fundInfoContent">
              <Typography fontVariant="smallBold">
                Total Participants
              </Typography>
              <Typography
                fontVariant="small"
                style={{
                  display: "flex",
                  gap: ".5rem",
                  alignItems: "center",
                }}
              >
                10000
                <PersonSVG />
              </Typography>
            </div>
            <div className="progressBarContainer">
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
              }}
              onClick={() => handleContribute()}
            >
              Contribute
            </Button>
            <Button
              style={{
                height: "2rem",
              }}
              onClick={() => handleWithdraw()}
            >
              withdraw
            </Button>
          </Card>
        </div>
        <div className="detailspProjectPostContainer">
          <div className="detailsProjectPosts">
            {dummyArray.map((e) => {
              return <PostCard />;
            })}
          </div>
          <div className="detailsProjectPostsStepBar">
            {PostSteps.map((e) => {
              return (
                <div
                  className="detailsProjectPostsSteps"
                  style={{
                    height: `${e.count * 365}px`,
                  }}
                >
                  <div className="stepText">
                    <Typography fontVariant="smallBold">{e.step}</Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="chatContainer">
        {chatOpen ? (
          <ChatCard setChatOpen={setChatOpen} />
        ) : (
          <div className="chatOpenButton" onClick={() => setChatOpen(true)}>
            <IoChatbubble />
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;
