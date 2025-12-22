import React from "react";
import TopBar from "./TopBar";
import Options from "./Options";
import Panels from "./Panels";
import Canvas from "./Canvas";
import Layers from "./Layers";
import Chatbox from "./Chatbox";

import "../Css/layout.css";

const Layout = () => {
  return (
    <div className="app-root">
      <TopBar />

      <div className="main-layout">
        <Options />
        <Panels />
        <Canvas />
        <Layers />
        <Chatbox />
      </div>
    </div>
  );
};

export default Layout;
