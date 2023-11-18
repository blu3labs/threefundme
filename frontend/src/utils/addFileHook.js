import { Web3Storage } from "web3.storage";

const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc0RDllMzMyODkwY0JjZUU3MTA2M2MxQzE5MzkxOGViNmI0Q2Y2MGIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTc1NDg3ODI1MzAsIm5hbWUiOiJ0ZXN0In0.dyU2juYc6AGCFlm8vMqGHYc-DaaGLAicm27M3x9-1Tw";

export const addFile = async (file) => {
  try {
    const client = new Web3Storage({
      token: key,
    });
    const fileCid = await client.put([file], { wrapWithDirectory: false });
    return "https://w3s.link/ipfs/" + fileCid;
  } catch (error) {
    console.log(error);

    return "err";
  }
};
