import React, { useState, useEffect } from "react";
import "./index.css";
import {
  Card,
  Input,
  FileInput,
  CrossSVG,
  PlusSVG,
  Typography,
  Button,
} from "@ensdomains/thorin";
function Create() {
  const [file, setFile] = useState();
  const [filePreview, setFilePreview] = useState();
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
  const [stepArray, setStepArray] = useState([])
  return (
    <div className="createContainer">
      <Card
        style={{
          width: "100%",
        }}
      >
        <div className="twoInputContainer">
          <div className="logoInput">
            Logo
            {filePreview && <img src={filePreview} />}
            <FileInput
              maxSize={1}
              onChange={(file) => setFile(file)}
              style={{
                width: "100%",
              }}
            >
              {(context) =>
                context.name ? (
                  <div
                    style={{
                      width: "100%",
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                    }}
                    onClick={context.reset}
                  >
                    <div
                      className="bannerInputButton"
                      style={{
                        backgroundColor: "blue",
                        width: "2rem",
                        height: "2rem",
                      }}
                      onClick={() => {
                        setFile(null);
                        setFilePreview(null);
                      }}
                    >
                      <CrossSVG
                        style={{
                          color: "#fff",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bannerInputButton">
                    <PlusSVG />
                  </div>
                )
              }
            </FileInput>
          </div>
          <div className="bannerInput">
            Banner
            {filePreview && <img src={filePreview} />}
            <FileInput
              maxSize={1}
              onChange={(file) => setFile(file)}
              style={{
                width: "100%",
              }}
            >
              {(context) =>
                context.name ? (
                  <div
                    style={{
                      width: "100%",
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                    }}
                    onClick={context.reset}
                  >
                    <div
                      className="bannerInputButton"
                      style={{
                        backgroundColor: "blue",
                        width: "2rem",
                        height: "2rem",
                      }}
                      onClick={() => {
                        setFile(null);
                        setFilePreview(null);
                      }}
                    >
                      <CrossSVG
                        style={{
                          color: "#fff",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bannerInputButton">
                    <PlusSVG />
                  </div>
                )
              }
            </FileInput>
          </div>
        </div>

        <div className="twoInputContainer">
          <Input placeholder="Enter your name" label="Name" suffix="text" />
        </div>
        <Input placeholder="Enter your name" label="Telegram" suffix="text" />

        <div className="twoInputContainer">
          <Input placeholder="Enter your name" label="Twiter" suffix="text" />
          <Input placeholder="Enter your name" label="Website" suffix="text" />
        </div>
        <div className="twoInputContainer">
          <Input
            placeholder="Enter your name"
            label="Minimum Buy"
            suffix="text"
          />
          <Input
            placeholder="Enter your name"
            label="Total Price"
            suffix="text"
          />
        </div>
        <div className="stepInptutContainer">
          <Input
            placeholder="lorem"
            label="Title"
            value={"Step 1"}
            prefix={"1"}
            disabled
          />
          <Input placeholder="Text..." label="Title" suffix="text" />
          <Input
            placeholder="Expired Date"
            label="Date"
            suffix="Date"
            type="Date"
          />
        </div>
        <div className="stepInptutContainer">
          <Input
            placeholder="lorem"
            label="Title"
            value={"Step 2"}
            prefix={"2"}
            disabled
          />
          <Input placeholder="Text..." label="Title" suffix="text" />
          <Input
            placeholder="Expired Date"
            label="Date"
            suffix="Date"
            type="Date"
          />
        </div>
        {stepArray?.map((item, index) => {
          return (
            <div className="stepInptutContainer">
              <Input
                placeholder="lorem"
                label="Title"
                value={`Step ${index + 3}`}
                prefix={index + 3}
                disabled
              />
              <Input placeholder="Text..." label="Title" suffix="text" />
              <Input
                placeholder="Expired Date"
                label="Date"
                suffix="Date"
                type="Date"
              />
            </div>
          );
        })}
        <Button onClick={() => 
        setStepArray([...stepArray, 1])
        }>Add Step</Button>
      </Card>
    </div>
  );
}

export default Create;
