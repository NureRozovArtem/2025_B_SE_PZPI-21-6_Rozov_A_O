import { useEffect, useState } from "react";
import "./ImageMemoryGame.css";
import Header from "./Header";


function ImageMemoryGame({ onBack }) {
  const [stage, setStage] = useState("loading");
  const [images, setImages] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);

  const exerciseId = 3;

  const allCards = [
    "2_of_clubs", "3_of_clubs", "4_of_clubs", "5_of_clubs", "6_of_clubs", "7_of_clubs", "8_of_clubs", "9_of_clubs", "10_of_clubs", "jack_of_clubs", "queen_of_clubs", "king_of_clubs", "ace_of_clubs",
    "2_of_diamonds", "3_of_diamonds", "4_of_diamonds", "5_of_diamonds", "6_of_diamonds", "7_of_diamonds", "8_of_diamonds", "9_of_diamonds", "10_of_diamonds", "jack_of_diamonds", "queen_of_diamonds", "king_of_diamonds", "ace_of_diamonds",
    "2_of_hearts", "3_of_hearts", "4_of_hearts", "5_of_hearts", "6_of_hearts", "7_of_hearts", "8_of_hearts", "9_of_hearts", "10_of_hearts", "jack_of_hearts", "queen_of_hearts", "king_of_hearts", "ace_of_hearts",
    "2_of_spades", "3_of_spades", "4_of_spades", "5_of_spades", "6_of_spades", "7_of_spades", "8_of_spades", "9_of_spades", "10_of_spades", "jack_of_spades", "queen_of_spades", "king_of_spades", "ace_of_spades",
    "black_joker", "red_joker"
  ];

  const cardNamesUa = {
    "2_of_clubs": "2 треф",
    "3_of_clubs": "3 треф",
    "4_of_clubs": "4 треф",
    "5_of_clubs": "5 треф",
    "6_of_clubs": "6 треф",
    "7_of_clubs": "7 треф",
    "8_of_clubs": "8 треф",
    "9_of_clubs": "9 треф",
    "10_of_clubs": "10 треф",
    "jack_of_clubs": "валет треф",
    "queen_of_clubs": "дама треф",
    "king_of_clubs": "король треф",
    "ace_of_clubs": "туз треф",

    "2_of_diamonds": "2 бубен",
    "3_of_diamonds": "3 бубен",
    "4_of_diamonds": "4 бубен",
    "5_of_diamonds": "5 бубен",
    "6_of_diamonds": "6 бубен",
    "7_of_diamonds": "7 бубен",
    "8_of_diamonds": "8 бубен",
    "9_of_diamonds": "9 бубен",
    "10_of_diamonds": "10 бубен",
    "jack_of_diamonds": "валет бубен",
    "queen_of_diamonds": "дама бубен",
    "king_of_diamonds": "король бубен",
    "ace_of_diamonds": "туз бубен",

    "2_of_hearts": "2 черв",
    "3_of_hearts": "3 черв",
    "4_of_hearts": "4 черв",
    "5_of_hearts": "5 черв",
    "6_of_hearts": "6 черв",
    "7_of_hearts": "7 черв",
    "8_of_hearts": "8 черв",
    "9_of_hearts": "9 черв",
    "10_of_hearts": "10 черв",
    "jack_of_hearts": "валет черв",
    "queen_of_hearts": "дама черв",
    "king_of_hearts": "король черв",
    "ace_of_hearts": "туз черв",

    "2_of_spades": "2 піка",
    "3_of_spades": "3 піка",
    "4_of_spades": "4 піка",
    "5_of_spades": "5 піка",
    "6_of_spades": "6 піка",
    "7_of_spades": "7 піка",
    "8_of_spades": "8 піка",
    "9_of_spades": "9 піка",
    "10_of_spades": "10 піка",
    "jack_of_spades": "валет піка",
    "queen_of_spades": "дама піка",
    "king_of_spades": "король піка",
    "ace_of_spades": "туз піка",

    "black_joker": "чорний джокер",
    "red_joker": "червоний джокер"
  };

  useEffect(() => {
    const fetchUserLevelAndImages = async () => {
      try {
        const resUser = await fetch("http://localhost:8080/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = await resUser.json();
        const difficulty = userData.difficulty || 1;
        setLevel(difficulty);

        const count = difficulty * 4;

        const resImages = await fetch(
          `http://localhost:8080/api/card-game/images?count=${count}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const imagesList = await resImages.json();

        if (Array.isArray(imagesList)) {
          setImages(imagesList);
          setUserOrder(new Array(count).fill(""));
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
        } else {
          console.error("Помилка: отримані дані не є масивом", imagesList);
        }
      } catch (e) {
        console.error("Помилка при завантаженні даних", e);
      }
    };

    fetchUserLevelAndImages();
  }, []);

  const handleOrderChange = (index, value) => {
    const newOrder = [...userOrder];
    newOrder[index] = value;
    setUserOrder(newOrder);
  };

  const handleSubmit = async () => {
    let correct = 0;
    for (let i = 0; i < images.length; i++) {
      const expected = images[i].imageUrl.split("/").pop().replace(".png", "");
      if (userOrder[i] === expected) correct++;
    }

    setScore(correct);
    setStage("result");

    try {
      await fetch("http://localhost:8080/api/game/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          exerciseId,
          correctAnswers: correct,
          totalQuestions: images.length,
        }),
      });
    } catch (e) {
      console.error("Помилка при відправці результату:", e);
    }
  };

  const renderImages = () => {
    return (
      <div className="image-sequence">
        {images.map((img, i) => {
          const frontImg = `http://localhost:8080${img.imageUrl}`;
          const backImg = "http://localhost:8080/cards/back.png";
          const isFlipped = stage === "input";

          return (
            <div key={i} className={`card ${isFlipped ? "flip" : ""}`}>
              <div className="card-inner">
                <div
                  className="card-face card-front"
                  style={{ backgroundImage: `url(${backImg})` }}
                >
                  <img src={frontImg} alt={`img-${i}`} />
                </div>
                <div
                  className="card-face card-back"
                  style={{ backgroundImage: `url(${backImg})` }}
                >
                  <img src={backImg} alt={`back-${i}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCardSelector = () => (
    <div className="input-sequence">
      {images.map((_, i) => (
        <select
          key={i}
          value={userOrder[i] || ""}
          onChange={(e) => handleOrderChange(i, e.target.value)}
        >
          <option value="">-- Обери карту --</option>
          {allCards.map((cardName) => (
            <option key={cardName} value={cardName}>
              {cardNamesUa[cardName] || cardName}
            </option>
          ))}
        </select>
      ))}
    </div>
  );

  return (
    <div>
      <Header showTopBar={false} />
    
      <div className="game-container">
        <button className="back" onClick={onBack}>
          ⬅ Назад
        </button>

        <h2>🃏 Памʼять на зображення</h2>

        {stage === "loading" && <p>Завантаження гри...</p>}

        {stage === "memorize" && (
          <>
            <p>Запамʼятай порядок карт (залишилось {timeLeft} с):</p>
            {renderImages()}
          </>
        )}

        {stage === "input" && (
          <>
            <p>Введи правильний порядок карт:</p>
            {renderImages()}
            {renderCardSelector()}
            <button className="back" onClick={handleSubmit}>Підтвердити</button>
          </>
        )}

        {stage === "result" && (
          <>
            <p>Твій результат: {score} / {images.length}</p>
            <p>Правильна послідовність:</p>
            {renderImages()}
          </>
        )}
      </div>
    </div>
  );
}

export default ImageMemoryGame;
