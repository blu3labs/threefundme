import React from "react";
import { Card, Typography, ScrollBox } from "@ensdomains/thorin";
function PostCard({ item }) {
  return (
    <Card
      style={{
        width: "100%",
        height: "350px",
        alignItems: "flex-end",
      }}
    >
      <div className="postContainer">
        <div className="postImageAndTitle">
          <div className="titleAndDate">
            <Typography fontVariant="largeBold">{item?.title}</Typography>
            <Typography fontVariant="small">{item?.date}</Typography>
          </div>
          {item?.type == "image" && (
            <img src={item?.file} className="postImage" />
          )}
          {item?.type == "video" && (
            <video
              src={item?.file}
              className="postImage"
              controls
            ></video>
          )}
          {item?.type == "audio" && (
            <audio
            style={{
              height: "4rem",
            }}
              src={item?.file}
              className="postImage"
              controls
              preload="auto"
            ></audio>
          )}
        </div>
        <div className="postDesc">
          <ScrollBox style={{ height: "100px" }}>
            <Typography fontVariant="small">{item?.desc}</Typography>
          </ScrollBox>
        </div>
      </div>
    </Card>
  );
}

export default PostCard;
