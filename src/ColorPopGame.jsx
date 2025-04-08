import React, { useState, useEffect, useRef } from "react";

const COLORS = [
  "#ff4d4d", "#4dd2ff", "#ffff66", "#99ff99", "#ff99cc", 
  "#ff6600", "#6600ff", "#33cc33", "#ffcc00", "#ff0066",
  "#00ccff", "#cc33ff", "#ff9999", "#66ff66", "#ffcc99"
];

const Bubble = ({ id, color, onPop }) => {
  const position = {
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
  };

  return (
    <div
      className="bubble"
      style={{
        ...position,
        backgroundColor: color,
      }}
      onClick={() => onPop(id)}
    ></div>
  );
};

const ColorPopGame = () => {
  const [bubble, setBubble] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0); // Track the current level
  const [message, setMessage] = useState("Click the bubble to pop!");
  const [gameStarted, setGameStarted] = useState(false);
  const [showMessage, setShowMessage] = useState(true); // Track message visibility
  const [gameOver, setGameOver] = useState(false); // Track game over state
  const audioRef = useRef(null); // Ref for background music
  const popSoundRef = useRef(null); // Ref for bubble pop sound
  const clapSoundRef = useRef(null); // Ref for clap sound

  useEffect(() => {
    if (bubble === null && gameStarted) {
      generateBubble();
    }
  }, [bubble, gameStarted]);

  useEffect(() => {
    if (gameStarted && audioRef.current) {
      audioRef.current.play(); // Play music when the game starts
    } else if (!gameStarted && audioRef.current) {
      audioRef.current.pause(); // Pause music when the game stops
      audioRef.current.currentTime = 0; // Reset music to the beginning
    }
  }, [gameStarted]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause(); // Pause music when the tab is not visible
      } else if (!document.hidden && gameStarted && audioRef.current) {
        audioRef.current.play(); // Resume music when the tab becomes visible
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange); // Cleanup event listener
    };
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      setShowMessage(true); // Show message when the game starts
      const timer = setTimeout(() => {
        setShowMessage(false); // Hide message after 1 second
      }, 1000);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [gameStarted]);

  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      setLevel(score / 10); // Update level based on score
      if (clapSoundRef.current) {
        const utterance = new SpeechSynthesisUtterance(`Level ${score / 10} Achieved!`);
        window.speechSynthesis.speak(utterance);
        // clapSoundRef.current.play(); // Play clap sound on level up
      }
    }
  }, [score]);

  useEffect(() => {
    if (score === 50) {
      setGameOver(true); // Stop the game
      if (clapSoundRef.current) {
        clapSoundRef.current.play(); // Play clap sound
      }
      setMessage("You reached the top! 🎉");
    }
  }, [score]);

  const generateBubble = () => {
    const newBubble = {
      id: Date.now(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setBubble(newBubble);
  };

  const handlePop = (id) => {
    if (bubble && bubble.id === id) {
      if (popSoundRef.current) {
        popSoundRef.current.play(); // Play pop sound
      }
      const colorName = getColorName(bubble.color); // Get the color name
      setTimeout(() => {
        speakColorName(colorName); // Speak the color name
      }, 300); // Delay to ensure sound plays first
      setScore((prev) => prev + 1);
      setBubble(null); // Remove the current bubble and generate a new one
    }
  };

  const speakColorName = (colorName) => {
    const utterance = new SpeechSynthesisUtterance(`${colorName}`);
    window.speechSynthesis.speak(utterance);
  };

  const getColorName = (color) => {
    const colorMap = {
      "#ff4d4d": "red",
      "#4dd2ff": "blue",
      "#ffff66": "yellow",
      "#99ff99": "green",
      "#ff99cc": "pink",
      "#ff6600": "orange",
      "#6600ff": "purple",
      "#33cc33": "lime",
      "#ffcc00": "gold",
      "#ff0066": "magenta",
      "#00ccff": "cyan",
      "#cc33ff": "violet",
      "#ff9999": "light red",
      "#66ff66": "light green",
      "#ffcc99": "peach",
    };
    return colorMap[color] || "unknown color";
  };

  const handleRestart = () => {
    setScore(0);
    setLevel(0); // Reset level
    setMessage("Click the bubble to start!");
    setBubble(null);
    setGameStarted(false); // Reset to game start screen
    setGameOver(false); // Reset game over state
  };

  const handleStartGame = () => {
    setGameStarted(true); // Start the game
  };

  const handleVolumeChange = (event) => {
    if (audioRef.current) {
      audioRef.current.volume = event.target.value; // Adjust volume
    }
  };

  return (
    <div className="game-container">
      <audio ref={audioRef} loop>
        <source src="/public/game-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio ref={popSoundRef}>
        <source src="/public/bubble-pop.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio ref={clapSoundRef}>
        <source src="/public/cheer.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {!gameStarted ? (
        <div className="start-screen">
          <h1 className="title">🎈 Welcome to Color Pop 🎈</h1>
          <button className="start-button" onClick={handleStartGame}>
            Start Game
          </button>
          <h3 className="devTitle">Developed by Kunal Sharma</h3>
          <p className="footer">
            Sound Effects by <a href="https://pixabay.com/">Pixabay</a>
          </p>
        </div>
      ) : gameOver ? (
        <div className="game-over-screen">
          <h1 className="title">🎉 You reached the top! 🎉</h1>
          <button className="restart-button" onClick={handleRestart}>
            Restart
          </button>
        </div>
      ) : (
        <>
          <h1 className="title">🎈 Color Pop 🎈</h1>
          <div className="score">Score: {score}</div>
          <div className="level">Level: {level}</div> {/* Display current level */}
          {showMessage && <div className="message">{message}</div>} {/* Show message conditionally */}
          {bubble && (
            <Bubble id={bubble.id} color={bubble.color} onPop={handlePop} />
          )}
          <button className="restart-button" onClick={handleRestart}>
            Restart
          </button>
          <div className="volume-control">
            <label htmlFor="volume">Volume: </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="1"
              onChange={handleVolumeChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPopGame;
