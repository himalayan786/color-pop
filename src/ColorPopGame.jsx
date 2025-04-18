import React, { useState, useEffect, useRef } from "react";

const COLORS = [
  "#ff4d4d", "#4dd2ff", "#ffff66", "#99ff99", "#ff99cc", 
  "#ff6600", "#6600ff", "#33cc33", "#ffcc00", "#ff0066",
  "#00ccff", "#cc33ff", "#ff9999", "#66ff66", "#ffcc99",
  "#000000", "#8b4513", "#808080" // Added black, brown, grey
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
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [showMessage, setShowMessage] = useState(true); // Track message visibility
  const [gameOver, setGameOver] = useState(false); // Track game over state
  const [bubbleSpeed, setBubbleSpeed] = useState(3000); // Initial bubble speed in milliseconds
  const [missedBubbles, setMissedBubbles] = useState(0); // Track missed bubbles
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
      }if (audioRef.current) {
        audioRef.current.pause(); // Stop the game music
        audioRef.current.currentTime = 0; // Reset music to the beginning
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
    }
  }, [gameStarted]);

  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      setLevel(score / 10); // Update level based on score
      setBubbleSpeed((prevSpeed) => Math.max(prevSpeed - 200, 500)); // Increase speed, minimum 500ms
      if (clapSoundRef.current) {
        const utterance = new SpeechSynthesisUtterance(`Level ${score / 10} Achieved!`);
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [score]);

  useEffect(() => {
    if (score === 50) {
      setGameOver(true); // Stop the game
      if (clapSoundRef.current) {
        clapSoundRef.current.play(); // Play clap sound
      }
      if (audioRef.current) {
        audioRef.current.pause(); // Stop the game music
        audioRef.current.currentTime = 0; // Reset music to the beginning
      }
      setMessage("You reached the top! 🎉");
    }
  }, [score]);

  useEffect(() => {
    if (missedBubbles >= 5 && score < 50) {
      setGameOver(true); // End the game if 5 bubbles are missed
      setMessage("You Lost. Better Luck Next Time! 😔");
      if (audioRef.current) {
        audioRef.current.pause(); // Stop the game music
        audioRef.current.currentTime = 0; // Reset music to the beginning
      }
    }
  }, [missedBubbles, score]);

  useEffect(() => {
    if (bubble) {
      const timer = setTimeout(() => {
        setBubble(null); // Remove bubble if not popped within the time limit
        setMissedBubbles((prev) => prev + 1); // Increment missed bubbles
      }, bubbleSpeed);
      return () => clearTimeout(timer); // Cleanup timer on bubble change
    }
  }, [bubble, bubbleSpeed]);

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
      "#99ff99": "light green",
      "#ff99cc": "pink",
      "#ff6600": "orange",
      "#6600ff": "purple",
      "#33cc33": "lime",
      "#ffcc00": "gold",
      "#ff0066": "magenta",
      "#00ccff": "cyan",
      "#cc33ff": "violet",
      "#ff9999": "light red",
      "#66ff66": "green",
      "#ffcc99": "peach",
      "#000000": "black", // Added black
      "#8b4513": "brown", // Added brown
      "#808080": "grey",  // Added grey
    };
    return colorMap[color] || "unknown color";
  };

  const handleRestart = () => {
    setScore(0);
    setLevel(0); // Reset level
    setMessage("");
    setBubble(null);
    setGameStarted(false); // Reset to game start screen
    setGameOver(false); // Reset game over state
    setMissedBubbles(0); // Reset missed bubbles
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
        <source src="./gamemusic.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio ref={popSoundRef}>
        <source src="./bubblepop.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio ref={clapSoundRef}>
        <source src="./cheer.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {!gameStarted ? (
        <div className="start-screen">
          <h1 className="title">🎈 Welcome to Color Pop 🎈</h1>
          <button className="start-button" onClick={handleStartGame}>
            Start Game
          </button>
          <h3 className="devTitle">Developed by Kunal Sharma</h3>
          <p>Click & Pop Bubbles!</p>
          <p className="footer">
            Sound Effects by <a href="https://pixabay.com/">Pixabay</a>
          </p>
        </div>
      ) : gameOver ? (
        <div className="game-over-screen">
          <h1 className="message">{message}</h1>
          <button className="restart-button" onClick={handleRestart}>
            Restart
          </button>
        </div>
      ) : (
        <>
          <h1 className="title">🎈 Color Pop 🎈</h1>
          <div className="score">Score: {score}</div>
          <div className="level">Level: {level}</div> {/* Display current level */}
          <div className="missed-bubbles">Missed: {missedBubbles}</div> {/* Display missed bubbles */}
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
