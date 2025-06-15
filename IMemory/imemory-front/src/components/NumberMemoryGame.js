import { useEffect, useState } from "react";
import Header from "./Header";


function NumberMemoryGame({ onBack }) {
  const [stage, setStage] = useState("loading"); 
  const [numbers, setNumbers] = useState([]);
  const [userInputs, setUserInputs] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);

  const exerciseId = 1; 

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        const difficulty = data.difficulty || 1;
        setLevel(difficulty);

        const count = difficulty * 5;
        const generated = Array.from({ length: count }, () =>
          Math.floor(Math.random() * 90 + 10)
        );

        setNumbers(generated);
        setUserInputs(new Array(count).fill(""));
        setStage("memorize");

        setTimeLeft(60); 

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
        console.error("Помилка при завантаженні рівня користувача", e);
      }
    };

    fetchUserLevel();

  }, []);

  const handleInputChange = (index, value) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  const handleSubmit = async () => {
    let correct = 0;
    userInputs.forEach((val, i) => {
      if (parseInt(val) === numbers[i]) {
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
          totalQuestions: numbers.length,
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

        <h2>🔢 Числова памʼять</h2>

        {stage === "loading" && <p>Завантаження гри...</p>}

        {stage === "memorize" && (
          <div>
            <p>Запамʼятай числа (залишилось {timeLeft} с):</p>
            <div className="number-sequence">
              {numbers.map((num, i) => (
                <span key={i} className="number-box">
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}

        {stage === "input" && (
          <div>
            <p>Введи запамʼятовані числа:</p>
            <div className="input-sequence">
              {userInputs.map((val, i) => (
                <input
                  key={i}
                  type="number"
                  value={val}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                  className="number-input"
                />
              ))}
            </div>
            <button className="back" onClick={handleSubmit}>Підтвердити</button>
          </div>
        )}

        {stage === "result" && (
          <div>
            <p>
              Твій результат: {score} / {numbers.length}
            </p>
            <p>Правильна послідовність:</p>
            <div className="number-sequence">
              {numbers.map((num, i) => (
                <span key={i} className="number-box">
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NumberMemoryGame;
