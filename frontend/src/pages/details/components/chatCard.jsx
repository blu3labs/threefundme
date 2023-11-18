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
function ChatCard({setChatOpen,  onSendMessage, messages, chatContent, setChatContent}) {
  const [chatText, setChatText] = React.useState("");
  console.log(messages,"msgsss")
  return (
    <Card
      style={{
        width: "25rem",
        height: "30rem",
        justifyContent: "space-between",
        gap: "0rem",
      }}
    >
      <ScrollBox style={{
        height: "23rem",
      }}>
        {messages.map((e, i) => {
          return (
            <div className="chatTextContainer">
              <div
                style={{
                  width: "4rem",
                  flexDirection: "column",
                  fontSize: "0.5rem",
                }}
              >
                <Avatar src={user} />
                {e.address.slice(0,5)}
              </div>
              <Typography fontVariant="extraSmall">
                {e.text}
              </Typography>
            </div>
          );
        })}
      </ScrollBox>
      <div className="chatInputContainer">
        <Input
          placeholder="Text..."
          size="small"
          value={chatContent}
          onChange={(e) => {setChatContent(e.target?.value)}}
          maxLength={100}
          style={{
            gap: "0rem",
          }}
        />
        <div className="sendButton" onClick={(e) => {
          onSendMessage(chatContent)
        }}>
          <AeroplaneSVG />
        </div>
      </div>
    </Card>
  );
}

export default ChatCard;
