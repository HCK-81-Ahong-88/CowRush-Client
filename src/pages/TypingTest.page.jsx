import { useEffect, useState } from "react";

export default function TypingTest() {
  const chunkSize = 20;
  const [words] = useState([
    "The",
    "land",
    "feels",
    "damp.",
    "Plants",
    "push",
    "forth",
    "from",
    "tiny",
    "seeds.",
    "Rain",
    "falls.",
    "Green",
    "moss",
    "grows.",
    "Birds",
    "sing.",
    "Trees",
    "sway.",
    "Life",
    "stirs.",
    "Bugs",
    "stirs.",
    "Bugs",
    "crawl.",
    "Sun",
    "sets.",
    "Stars",
    "gleam.",
    "Air",
    "chills.",
    "Wolves",
    "howl.",
    "chills.",
    "Wolves",
    "howl.",
    "Paths",
    "twist.",
    "Roots",
    "grow.",
    "Soil",
    "packs.",
    "Seeds",
    "wait.",
    "More",
    "Soil",
    "packs.",
    "Seeds",
    "wait.",
    "More",
    "Soil",
    "packs.",
    "Seeds",
    "wait.",
    "More",
    "Soil",
    "packs.",
    "Seeds",
    "wait.",
    "More",
    "Soil",
    "packs.",
    "Seeds",
    "wait.",
    "More",
  ]);

  // currentWordIndex menyimpan index global kata yang sedang diketik
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");

  // computed: menentukan chunk index berdasarkan currentWordIndex
  const currentChunkStart =
    Math.floor(currentWordIndex / chunkSize) * chunkSize;
  const displayedWords = words.slice(
    currentChunkStart,
    currentChunkStart + chunkSize
  );

  // Kata yang sedang aktif (dari array global)
  const currentWord = words[currentWordIndex];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTypedWord(value);

    // Jika pengguna mengetik spasi di akhir kata,
    // periksa apakah kata yang diketik sesuai dengan kata yang seharusnya
    if (value.endsWith(" ")) {
      // Trim spasi agar tidak terpengaruh spasi tambahan
      if (value.trim() === currentWord) {
        // Pindah ke kata berikutnya
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      }
      // Reset input meskipun kata salah, atau bisa ditambahkan logika error/warning
      setTypedWord("");
    }
  };
  console.log("current chunk start:", currentChunkStart);
  return (
    <div className="w-50 m-auto mt-5">
      <div>
        <p>Opponent WPM: 200</p>
        <p>Time Left: 200</p>
      </div>

      {/* Tampilan kata-kata */}
      <div className="fs-3 mb-3">
        {displayedWords.map((word, i) => {
          // Hitung index global untuk tiap kata di tampilan
          const globalIndex = currentChunkStart + i;
          // Tandai kata yang sedang aktif
          const isActive = globalIndex === currentWordIndex;
          // Tandai kata yang sudah benar (yang index-nya kurang dari currentWordIndex)
          const isCompleted = globalIndex < currentWordIndex;
          return (
            <span
              key={i}
              style={{
                padding: "2px",
                backgroundColor: isActive ? "#DDDDDD" : "transparent",
                color: isCompleted ? "green" : "black",
              }}
            >
              {word}{" "}
            </span>
          );
        })}
      </div>

      {/* Input pengguna */}
      <div className="mb-3">
        <label className="form-label">Input</label>
        <input
          type="text"
          className="form-control"
          value={typedWord}
          onChange={handleInputChange}
          autoFocus
        />
      </div>

      {/* Tampilan informasi */}
      <div>
        <p>Current Word: {currentWord}</p>
        <p>Current Index: {currentWordIndex}</p>
      </div>
    </div>
  );
}
