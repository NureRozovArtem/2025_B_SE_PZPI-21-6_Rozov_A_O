import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NumberMemoryGame from "./NumberMemoryGame";
import WordMemoryGame from "./WordMemoryGame";
import ImageMemoryGame from "./ImageMemoryGame";
import ProfilePage from "./ProfilePage";
import Header from "./Header";


function Dashboard({ onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Token invalid or expired");
        }
      } catch (error) {
        console.warn("Недійсний токен. Вихід з акаунту...");
        localStorage.removeItem("token");
        onLogout();
        navigate("/login");
      }
    };

    checkToken();
  }, [onLogout, navigate]);

  const handleBack = () => {
    setCurrentGame(null);
    setShowProfile(false);
    setShowInfo(false);
  };

  if (currentGame === "number") return <NumberMemoryGame onBack={handleBack} />;
  if (currentGame === "word") return <WordMemoryGame onBack={handleBack} />;
  if (currentGame === "image") return <ImageMemoryGame onBack={handleBack} />;

  if (showProfile) return <ProfilePage onBack={handleBack} onLogout={onLogout} />;

  if (showInfo) {
    return (
      <div>
        <Header />
        <div className="info-page">
          <button className="back" onClick={handleBack}>⬅ Назад</button>
          <h2>Як покращити памʼять?</h2>
          <p>
            Памʼять — це здатність мозку зберігати, обробляти та відтворювати інформацію. Вона буває:
          </p>
          <ul>
            <li><strong>Короткочасна памʼять</strong> — зберігає інформацію на декілька секунд/хвилин.</li>
            <li><strong>Довготривала памʼять</strong> — зберігає інформацію надовго (від днів до років).</li>
            <li><strong>Оперативна памʼять</strong> — дозволяє тимчасово утримувати дані під час мислення.</li>
          </ul>
          <p>Щоб покращити памʼять, корисно:</p>
          <ul>
            <li>Регулярно тренувати мозок (ігри, задачі, вправи).</li>
            <li>Здорово спати та харчуватись.</li>
            <li>Використовувати асоціації та візуалізацію.</li>
          </ul>
          <p>На цьому сайті ти можеш тренувати памʼять через ігри:</p>
          <ul>
            <li><strong>Числова памʼять</strong> — запамʼятовуй послідовності чисел.</li>
            <li><strong>Памʼять на слова</strong> — згадуй запамʼятовані слова.</li>
            <li><strong>Памʼять на зображення</strong> — тренуй зорову памʼять за допомогою картинок.</li>
          </ul>
          <p>Використовуй ці ігри регулярно — і твоя памʼять покращиться!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        showTopBar={true}
        setShowProfile={setShowProfile}
        setShowInfo={setShowInfo}
      />
      <div className="dashboard">
        <div className="main-content">
          <h1>Покращуй свою пам’ять!</h1>
          <div className="game-buttons">
            <button className="game-btn" onClick={() => setCurrentGame("number")}>🔢 Числа</button>
            <button className="game-btn" onClick={() => setCurrentGame("word")}>🧠 Слова</button>
            <button className="game-btn" onClick={() => setCurrentGame("image")}>🎨 Зображення</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
