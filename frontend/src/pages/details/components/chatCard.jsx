import React from "react";
import {
  Avatar,
  Card,
  Input,
  Typography,
  AeroplaneSVG,
  ScrollBox,
} from "@ensdomains/thorin";
import user from "../../../assets/user.svg";
import { IoMdClose } from "react-icons/io";
import { useAccount } from "wagmi";
function ChatCard({
  setChatOpen,
  onSendMessage,
  messages,
  chatContent,
  setChatContent,
  details,
}) {
  const { address } = useAccount();
  return (
    <Card
      style={{
        width: "25rem",
        height: "30rem",
        justifyContent: "space-between",
        gap: "0rem",
        alignItems: "flex-end",
        position: "relative",
      }}
    >
      <div className="closebutton" onClick={() => setChatOpen(false)}>
        <Typography fontVariant="small" color="white">
          {details?.name}
        </Typography>
        <IoMdClose />
      </div>
      <ScrollBox
        style={{
          height: "23rem",
          width: "100%",
          marginTop: "1rem",
        }}
      >
        {messages.map((e, i) => {
          const owner = e.address === address;
          return (
            <div
              className="chatTextContainer"
              style={{
                justifyContent: owner && "flex-start",
                flexDirection: owner && "row-reverse",
              }}
              key={i}
            >
              <div
                style={{
                  width: "3rem",
                  flexDirection: "column",
                  fontSize: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                <Avatar src={user} />
                {e.address.slice(0, 4) + "..." + e.address.slice(-4)}
              </div>
              <Typography fontVariant="extraSmall">{e.text}</Typography>
            </div>
          );
        })}
      </ScrollBox>
      <div className="chatInputContainer">
        <Input
          placeholder="Text..."
          size="small"
          value={chatContent}
          onChange={(e) => {
            setChatContent(e.target?.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSendMessage(chatContent);
            }
          }}
          maxLength={100}
          style={{
            gap: "0rem",
          }}
        />
        <div
          className="sendButton"
          onClick={(e) => {
            onSendMessage(chatContent);
          }}
        >
          <AeroplaneSVG />
        </div>
      </div>
    </Card>
  );
}

export default ChatCard;
