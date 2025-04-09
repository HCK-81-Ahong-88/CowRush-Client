import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const socket = io("http://localhost:3000");

export default function TypingTest() {
	const chunkSize = 20;
	const [words, setWords] = useState([]);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [typedWord, setTypedWord] = useState("");
	const [countdown, setCountdown] = useState(null);
	const [gameStarted, setGameStarted] = useState(false);
	const [score, setScore] = useState(null);

	useEffect(() => {
		socket.on("waiting", ({ message }) => {
			Swal.fire({ icon: "info", title: "Waiting", text: message });
		});

		socket.on("start", ({ paragraph }) => {
			setWords(paragraph);
			Swal.fire({ icon: "success", title: "Game Starting Soon", text: "Get ready!" });
		});

		socket.on("countdown", ({ countdown }) => setCountdown(countdown));

		socket.on("gameStart", () => {
			setGameStarted(true);
			setCountdown(null);
		});

		socket.on("gameEnd", ({ status, score }) => {
			setGameStarted(false);
			setScore(score);
			Swal.fire({ icon: "info", title: "Game Over", text: `Status: ${status}, Score: ${score}` });
		});

		return () => socket.disconnect();
	}, []);

	const joinGame = () => {
		socket.emit("join", { style: "Slang/Informal" });
	};

	const currentChunkStart = Math.floor(currentWordIndex / chunkSize) * chunkSize;
	const displayedWords = words.slice(currentChunkStart, currentChunkStart + chunkSize);
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

	return (
		<div className="w-50 m-auto mt-5">
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
								backgroundColor: isActive ? "#DDDDDD" : "transparent",
								color: isCompleted ? "green" : "black",
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
