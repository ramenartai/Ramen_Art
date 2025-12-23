// Layout.js
import React from "react";
import TopBar from "./TopBar";
import Options from "./Options";
import Panels from "./Panels";
import Canvas from "./Canvas";
import Layers from "./Layers";
import Chatbox from "./Chatbox";
import Storyboard from "../Story/StoryBoard";
import "../Css/layout.css";

const Layout = () => {
  const [isStoryboardOpen, setIsStoryboardOpen] = React.useState(() => {
    // read initial value from localStorage on first render
    const stored = window.localStorage.getItem("isStoryboardOpen");
    return stored ? JSON.parse(stored) : false;
  });

  // whenever it changes, write to localStorage
  React.useEffect(() => {
    window.localStorage.setItem(
      "isStoryboardOpen",
      JSON.stringify(isStoryboardOpen)
    );
  }, [isStoryboardOpen]);

  return (
    <div className="app-root">
      <TopBar />
      <div className="main-layout">
        <Options
          onOpenStoryboard={() => setIsStoryboardOpen(true)}
        />
        <Panels />
        <Canvas />
        <Layers />
        <Chatbox />
      </div>

      {isStoryboardOpen && (
        <Storyboard onClose={() => setIsStoryboardOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
