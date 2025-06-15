import { useEffect, useState } from "react";
import Header from "./Header";


function WordMemoryGame({ onBack }) {
  const [stage, setStage] = useState("loading"); 
  const [words, setWords] = useState([]);
  const [userInputs, setUserInputs] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);

  const exerciseId = 2; 

  useEffect(() => {
    const fetchUserLevelAndWords = async () => {
      try {
        const resUser = await fetch("http://localhost:8080/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = await resUser.json();
        const difficulty = userData.difficulty || 1;
        setLevel(difficulty);

        const count = difficulty * 3; 

        const resWords = await fetch(`http://localhost:8080/api/game/words?count=${count}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const wordList = await resWords.json();

        setWords(wordList);
        setUserInputs(new Array(count).fill(""));
        setStage("memorize");

        let interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev === 1) {
              clearInterval(interval);
              setStage("input");
            }
            return prev - 1;
          });
        }, 1000);
      } catch (e) {
        console.error("Помилка при завантаженні даних", e);
      }
    };

    fetchUserLevelAndWords();
  }, []);

  const handleInputChange = (index, value) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  const handleSubmit = async () => {
    let correct = 0;
    userInputs.forEach((val, i) => {
      if (val.trim().toLowerCase() === words[i].toLowerCase()) {
        correct++;
      }
    });
    setScore(correct);
    setStage("result");

    try {
      const res = await fetch("http://localhost:8080/api/game/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          exerciseId,
          correctAnswers: correct,
          totalQuestions: words.length,
        }),
      });

      if (!res.ok) {
        console.error("Не вдалося зберегти результат");
      }
    } catch (e) {
      console.error("Помилка при відправці результату:", e);
    }
  };

  return (
      <div>
        <Header showTopBar={false} />

      <div className="game-container">
        <button className="back" onClick={onBack}>
          ⬅ Назад
        </button>

        <h2>📝 Памʼять на слова</h2>

        {stage === "loading" && <p>Завантаження гри...</p>}

        {stage === "memorize" && (
          <div>
            <p>Запамʼятай слова (залишилось {timeLeft} с):</p>
            <div className="word-sequence">
              {Array.isArray(words) && words.map((word, i) => (
                <span key={i} className="word-box">{word}</span>
              ))}
            </div>
          </div>
        )}

        {stage === "input" && (
          <div>
            <p>Введи запамʼятовані слова у правильному порядку:</p>
            <div className="input-sequence">
              {userInputs.map((val, i) => (
                <input
                  key={i}
                  type="text"
                  value={val}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  className="word-input"
                  autoComplete="off"
                />
              ))}
            </div>
            <button className="back" onClick={handleSubmit}>Підтвердити</button>
          </div>
        )}

        {stage === "result" && (
          <div>
            <p>Твій результат: {score} / {words.length}</p>
            <p>Правильна послідовність:</p>
            <div className="word-sequence">
              {words.map((word, i) => (
                <span key={i} className="word-box">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WordMemoryGame;