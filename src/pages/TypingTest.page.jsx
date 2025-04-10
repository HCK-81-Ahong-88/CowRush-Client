import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { useSocket } from "../contexts/socket.context";
import { ThemeContext } from "../contexts/theme.context";
import LoadingPage from "./LoadingPage";

export default function TypingTest() {
	const socket = useSocket();
	const { theme } = useContext(ThemeContext);

	const chunkSize = 20;
	const [words, setWords] = useState([]);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [typedWord, setTypedWord] = useState("");
	const [countdown, setCountdown] = useState(null);
	const [gameStarted, setGameStarted] = useState(false);
	const [score, setScore] = useState(null);
	const [isWaiting, setIsWaiting] = useState(false);
	const [waiting, setWaiting] = useState(false);

	useEffect(() => {
		const handleWaiting = () => {
			setIsWaiting(true);
			setWaiting(true);
		};
		const handleStart = ({ paragraph }) => {
			setIsWaiting(false);
			setWaiting(false);
			setWords(paragraph);
			Swal.fire({ icon: "success", title: "Game Starting Soon", text: "Get ready!" });
		};
		const handleCountdown = ({ countdown }) => setCountdown(countdown);
		const handleGameStart = () => {
			setGameStarted(true);
			setCountdown(180);
			const interval = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		};
		const handleGameEnd = ({ status, score }) => {
			setGameStarted(false);
			setScore(score);
			Swal.fire({ icon: "info", title: "Game Over", text: `Status: ${status}, Score: ${score}` });
			setCountdown(null);
		};

		socket.on("waiting", handleWaiting);
		socket.on("start", handleStart);
		socket.on("countdown", handleCountdown);
		socket.on("gameStart", handleGameStart);
		socket.on("gameEnd", handleGameEnd);

		return () => socket.disconnect();
	}, [socket]);

	const resetState = () => {
		setCurrentWordIndex(0);
		setTypedWord("");
		setCountdown(null);
		setGameStarted(false);
		setScore(null);
		setIsWaiting(false);
	};

	const joinGame = () => {
		resetState();
		setWaiting(true);
		const styles = ["Old English-esque", "Modern Standard", "Slang/Informal", "Gen Z"];
		socket.emit("join", { style: styles[Math.floor(Math.random() * styles.length)] });
	};

	const currentChunkStart = Math.floor(currentWordIndex / chunkSize) * chunkSize;
	const displayedWords = words.slice(currentChunkStart, currentChunkStart + chunkSize);
	const currentWord = words[currentWordIndex];

	const handleInputChange = (e) => {
		const value = e.target.value;
		setTypedWord(value);
		if (value.endsWith(" ") && value.trim() === currentWord) {
			setCurrentWordIndex((prev) => prev + 1);
			socket.emit("counter", { counter: currentWordIndex + 1 });
			setTypedWord("");
		}
	};

	if (waiting || isWaiting) {
		return <LoadingPage />;
	}

	return (
		<div className="w-50 m-auto mt-5 p-3" style={{ minHeight: "80vh", transition: "all 0.3s" }}>
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
								backgroundColor: isActive ? (theme === "dark" ? "#444" : "#DDDDDD") : "transparent",
								color: isCompleted ? (theme === "dark" ? "lightgreen" : "green") : theme === "dark" ? "#fff" : "#000",
								transition: "background-color 0.3s, color 0.3s",
							}}>
							{word}{" "}
						</span>
					);
				})}
			</div>
			<div className="mb-3">
				<label className="form-label">Input</label>
				<input type="text" className="form-control" value={typedWord} onChange={handleInputChange} disabled={!gameStarted} autoFocus />
			</div>
			<div>
				{score !== null && <p>Your Score: {score}</p>}
				<p>Current Word: {currentWord}</p>
				<p>Current Index: {currentWordIndex}</p>
			</div>
		</div>
	);
}
