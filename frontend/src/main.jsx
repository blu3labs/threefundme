import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "styled-components";
import { ThorinGlobalStyles, lightTheme, darkTheme } from "@ensdomains/thorin";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { sepolia, baseGoerli, lineaTestnet, scrollSepolia } from "wagmi/chains";

const projectId = "149f5175dc4a4bc3d18eb9a1792c2ecc";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [sepolia, baseGoerli, lineaTestnet, scrollSepolia];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <ThemeProvider theme={lightTheme}>
        <App />
        <ThorinGlobalStyles />
      </ThemeProvider>
    </WagmiConfig>
  </React.StrictMode>
);
