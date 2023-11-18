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
          <img src={item?.img} className="postImage" />
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
