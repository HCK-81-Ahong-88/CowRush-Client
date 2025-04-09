import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const socket = io("http://localhost:3000"); // Ganti dengan URL server Anda

export default function TypingTest() {
	const chunkSize = 20;
	const [words, setWords] = useState([]);
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [typedWord, setTypedWord] = useState("");
	const [countdown, setCountdown] = useState(null);
	const [gameStarted, setGameStarted] = useState(false);
	const [score, setScore] = useState(null);

	useEffect(() => {
		// Event ketika menunggu pemain lain
		socket.on("waiting", ({ message }) => {
			Swal.fire({
				icon: "info",
				title: "Waiting",
				text: message,
			});
		});

		// Event ketika game dimulai dengan paragraf
		socket.on("start", ({ paragraph }) => {
			// Membagi paragraf menjadi kelompok kata berdasarkan chunkSize
			const wordChunks = [];
			for (let i = 0; i < paragraph.length; i += chunkSize) {
				wordChunks.push(paragraph.slice(i, i + chunkSize));
			}

			setWords(wordChunks.flat()); // Gabungkan semua kelompok menjadi satu array
			Swal.fire({
				icon: "success",
				title: "Game Starting Soon",
				text: "Get ready!",
			});
		});

		// Event countdown sebelum game dimulai
		socket.on("countdown", ({ countdown }) => {
			setCountdown(countdown);
		});

		// Event ketika game dimulai
		socket.on("gameStart", () => {
			setGameStarted(true);
			setCountdown(null);
		});

		// Event ketika game berakhir
		socket.on("gameEnd", ({ status, score }) => {
			setGameStarted(false);
			setScore(score);
			Swal.fire({
				icon: "info",
				title: "Game Over",
				text: `Status: ${status}, Score: ${score}`,
			});
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const joinGame = () => {
		socket.emit("join", { style: "American English" }); // Ganti style sesuai kebutuhan
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		setTypedWord(value);

		if (value.endsWith(" ")) {
			if (value.trim() === words[currentWordIndex]) {
				setCurrentWordIndex((prevIndex) => prevIndex + 1);
				socket.emit("counter", { counter: currentWordIndex + 1 });
			}
			setTypedWord("");
		}
	};

	return (
		<div className="w-50 m-auto mt-5">
			<button onClick={joinGame} className="btn btn-primary mb-3">
				Join Game
			</button>

			{countdown !== null && <p>Countdown: {countdown}</p>}
			{gameStarted && <p>Game is running!</p>}
			{words.length > 0 && (
				<div className="fs-3 mb-3">
					{words.map((word, i) => (
						<span
							key={i}
							style={{
								padding: "2px",
								backgroundColor: i === currentWordIndex ? "#DDDDDD" : "transparent",
								color: i < currentWordIndex ? "green" : "black",
							}}>
							{word}{" "}
						</span>
					))}
				</div>
			)}
			<input type="text" className="form-control" value={typedWord} onChange={handleInputChange} disabled={!gameStarted} autoFocus />
			{score !== null && <p>Your Score: {score}</p>}
		</div>
	);
}
