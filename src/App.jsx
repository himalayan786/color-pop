// src/App.jsx
import React, { useState } from "react";
import ColorPopGame from "./ColorPopGame";

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleStop = () => {
    setGameStarted(false);
  };

  return (
    <div>
      {gameStarted ? (
        <ColorPopGame onStop={handleStop} />
      ) : (
        <div className="home-screen">
          <h1 className="title">🎨 Color Pop 🎈</h1>
          <button className="start-button" onClick={handleStart}>
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
