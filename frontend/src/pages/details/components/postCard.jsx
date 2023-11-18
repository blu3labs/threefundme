import React from "react";
import { Card, Typography, ScrollBox } from "@ensdomains/thorin";
function PostCard() {
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
            <Typography fontVariant="largeBold">Project Started</Typography>
            <Typography fontVariant="small">15/03/2023 15:35</Typography>
          </div>
          <img
            src="https://cdn.motor1.com/images/mgl/VA0z9/s1/4x3/tesla-roadster.webp"
            className="postImage"
          />
        </div>
        <div className="postDesc">
          <ScrollBox style={{ height: "100px" }}>
            <Typography fontVariant="small">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum
              non impedit voluptatum nisi blanditiis molestias adipisci eius
              neque velit alias cumque fugit, quibusdam eaque sunt, nesciunt
              sint sed aliquam laborum veniam perspiciatis! Veritatis, ducimus
              quia praesentium, quis nihil commodi optio omnis iure id nam
              maiores, excepturi quae a mollitia totam veniam facere saepe unde
              aut delectus ad incidunt aliquam eum minima! Quos quo non a quidem
              laboriosam ratione inventore molestiae nemo eos, vel fugit nulla
              ab! Earum consequuntur, ut nisi debitis accusamus voluptatem quo,
              aut tempore pariatur molestiae est quisquam facilis temporibus
              voluptas soluta saepe similique placeat. Aut incidunt distinctio
              eum debitis quis magni deserunt, sapiente perspiciatis harum,
              nobis possimus natus labore ut perferendis eligendi sint quisquam
              nesciunt blanditiis ad laboriosam, ab mollitia minima qui.
              Voluptates nihil fugiat quaerat eaque quos! Nulla eligendi
              distinctio, odio ipsa voluptate perspiciatis, quam, dolore dicta
              nam pariatur quia voluptatum blanditiis asperiores autem
              consequuntur alias suscipit aliquid? Rem error, libero tempora
              dignissimos excepturi nulla hic, provident iusto neque quisquam
              officia cumque id nam explicabo dolorem veritatis tempore. Non
              nemo doloribus odio nihil ex? Rerum obcaecati ullam quaerat minima
              corporis esse hic quisquam suscipit commodi ipsa voluptatum,
              delectus incidunt eum quo illo sit atque ratione! Minima?
            </Typography>
          </ScrollBox>
        </div>
      </div>
    </Card>
  );
}

export default PostCard;
