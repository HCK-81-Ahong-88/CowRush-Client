import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { useSocket } from "../contexts/socket.context";
import { ThemeContext } from "../contexts/theme.context";

export default function TypingTest() {
  const socket = useSocket();

  const chunkSize = 20;
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    socket.on("waiting", ({ message }) => {
      Swal.fire({ icon: "info", title: "Waiting", text: message });
    });

    socket.on("start", ({ paragraph }) => {
      setWords(paragraph);
      Swal.fire({
        icon: "success",
        title: "Game Starting Soon",
        text: "Get ready!",
      });
    });

    socket.on("countdown", ({ countdown }) => setCountdown(countdown));

    socket.on("gameStart", () => {
      setGameStarted(true);
      setCountdown(null);
    });

    socket.on("gameEnd", ({ status, score }) => {
      setGameStarted(false);
      setScore(score);
      Swal.fire({
        icon: "info",
        title: "Game Over",
        text: `Status: ${status}, Score: ${score}`,
      });
    });

    return () => socket.disconnect();
  }, []);

  const resetState = () => {
    setCurrentWordIndex(0);
    setTypedWord("");
    setCountdown(null);
    setGameStarted(false);
    setScore(null);
  };

  const joinGame = () => {
    resetState();
    socket.emit("join", { style: "Slang/Informal" });
  };

  const currentChunkStart =
    Math.floor(currentWordIndex / chunkSize) * chunkSize;
  const displayedWords = words.slice(
    currentChunkStart,
    currentChunkStart + chunkSize
  );
  const currentWord = words[currentWordIndex];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTypedWord(value);

    if (value.endsWith(" ")) {
      if (value.trim() === currentWord) {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
        socket.emit("counter", { counter: currentWordIndex + 1 });
      }
      setTypedWord("");
    }
  };

  const containerClass =
    theme === "dark" ? "bg-dark text-white" : "bg-light text-dark";

  return (
    <div
      className={`w-50 m-auto mt-5 p-3 ${containerClass}`}
      style={{ minHeight: "80vh", transition: "all 0.3s" }}
    >
      {!gameStarted && (
        <button onClick={joinGame} className="btn btn-primary mb-3">
          Join Game
        </button>
      )}
      <div>
        {countdown !== null && <p>Countdown: {countdown}</p>}
        {gameStarted && <p>Game is running!</p>}
      </div>
      <div className="fs-3 mb-3">
        {displayedWords.map((word, i) => {
          const globalIndex = currentChunkStart + i;
          const isActive = globalIndex === currentWordIndex;
          const isCompleted = globalIndex < currentWordIndex;
          return (
            <span
              key={i}
              style={{
                padding: "2px",
                backgroundColor: isActive
                  ? theme === "dark"
                    ? "#444"
                    : "#DDDDDD"
                  : "transparent",
                color: isCompleted
                  ? theme === "dark"
                    ? "lightgreen"
                    : "green"
                  : theme === "dark"
                  ? "#fff"
                  : "#000",
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              {word}{" "}
            </span>
          );
        })}
      </div>
      <div className="mb-3">
        <label className="form-label">Input</label>
        <input
          type="text"
          className={`form-control ${
            theme === "dark" ? "bg-secondary text-white" : ""
          }`}
          value={typedWord}
          onChange={handleInputChange}
          disabled={!gameStarted}
          autoFocus
        />
      </div>
      <div>
        {score !== null && <p>Your Score: {score}</p>}
        <p>Current Word: {currentWord}</p>
        <p>Current Index: {currentWordIndex}</p>
      </div>
    </div>
  );
}
