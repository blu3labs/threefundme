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
function ChatCard() {
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
        {[...Array(10)].map((e, i) => {
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
                0X00..000
              </div>
              <Typography fontVariant="extraSmall">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad
                doloremque
              </Typography>
            </div>
          );
        })}
      </ScrollBox>
      <div className="chatInputContainer">
        <Input
          placeholder="Text..."
          size="small"
          maxLength={100}
          style={{
            gap: "0rem",
          }}
        />
        <div className="sendButton">
          <AeroplaneSVG />
        </div>
      </div>
    </Card>
  );
}

export default ChatCard;
