import { useEffect, useState } from "react";

export default function TypingTest() {
  const [words, setWords] = useState([
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
  ]);
  const [currentWord, setCurrentWord] = useState("");
  const [indexCurrentWord, setIndexCurrentWord] = useState(0);
  const [indexNextWord, setIndexNextWord] = useState(1);
  const [typedWord, setTypedWord] = useState("");
  const [totalWord, setTotalWord] = useState(0);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [wordWatcher, setWordWatcher] = useState(20);

  useEffect(() => {
    setCurrentWord(words[0]);
    setTotalWord(1);
    setDisplayedWords(
      words.map((word, index) => {
        if (index < 20) {
          return word;
        }
      })
    );
  }, []);

  useEffect(() => {
    if (typedWord[typedWord.length - 1] === " ") {
      if (typedWord.split(" ")[0] === currentWord) {
        const nextIndex = indexCurrentWord + 1;
        setTotalWord(totalWord + 1);
        setIndexCurrentWord(nextIndex);
        setIndexNextWord(nextIndex + 1);
        setCurrentWord(words[nextIndex]);
        setTypedWord("");

        let flagCurrentWord = indexCurrentWord;
        let flagCounter = 1;
        if (flagCurrentWord === displayedWords.length) {
          setDisplayedWords(
            words.map((word, index) => {
              if (index >= flagCurrentWord && flagCounter <= 20) {
                return word;
              }
              flagCounter++;
            })
          );
          setWordWatcher(wordWatcher + 20);
        }
      }
      console.log("word watcher:", wordWatcher);
      console.log("Index current word:", indexCurrentWord);
    }
  }, [typedWord]);

  return (
    <>
      <div className="w-50 m-auto mt-5">
        <div className="fs-3">
          {displayedWords.map((word, index) => {
            return (
              <span key={index}>
                <span
                  className={
                    indexCurrentWord < indexNextWord ? "text-success" : ""
                  }
                  style={
                    indexCurrentWord === indexCurrentWord
                      ? { backgroundColor: "#DDDDDD" }
                      : {}
                  }
                >
                  {word}
                </span>
                <span> </span>
              </span>
            );
          })}
        </div>
        <div className="mb-3">
          <label className="form-label">Input</label>
          <input
            type="text"
            className="form-control"
            value={typedWord}
            onChange={(e) => {
              setTypedWord(e.target.value);
            }}
          />
        </div>
        <div>{typedWord}</div>
        <div>{currentWord}</div>
      </div>
      <div className="d-flex gap-2">
        <p>WPM: 20</p>
        <p>WPM: 20</p>
      </div>
    </>
  );
}
