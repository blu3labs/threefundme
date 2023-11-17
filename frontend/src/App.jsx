import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//pages
import Home from "./pages/home";
import Create from "./pages/create";
import Details from "./pages/details";

//components
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    <BrowserRouter>
      <div className="appContainer">
        sss
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
