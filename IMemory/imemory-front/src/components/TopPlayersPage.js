import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TopPlayerPage.css";
import Header from "./Header";

function TopPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/game/top-players")
      .then((res) => res.json())
      .then((data) => {
        const filteredPlayers = data.filter((p) => p.totalScore > 0);
        setPlayers(filteredPlayers);
      })
      .catch((err) => console.error("Помилка при завантаженні гравців", err));

    fetch("http://localhost:8080/api/user/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((userData) => setCurrentUser(userData))
      .catch(() => setCurrentUser(null));
  }, []);

  const currentUserRank = currentUser
    ? players.findIndex((p) => p.username === currentUser.username)
    : -1;

  return (
    <div>
      <Header showTopBar={false} />

      <div className="top-players-container">
        <button className="back-button-small" onClick={() => navigate("/")}>
          ⬅ Назад
        </button>
        <h2>🏆 Кращі гравці</h2>
        <p className="explanation-text">
          Загальний рахунок - це сума найкращих результатів кожної гри.
        </p>

        <table className="top-players-table">
          <thead>
            <tr>
              <th>Місце</th>
              <th>Імʼя</th>
              <th>Загальний рахунок</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => {
              const isCurrentUser = currentUser && player.username === currentUser.username;
              return (
                <tr
                  key={player.username}
                  style={{
                    backgroundColor: isCurrentUser ? "#d1e7dd" : "transparent", 
                    fontWeight: isCurrentUser ? "600" : "normal",
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{player.username}</td>
                  <td>{player.totalScore}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {currentUser && currentUserRank !== -1 ? (
          <div className="current-user-result">
            <h3>Ваш результат:</h3>
            <table className="top-players-table">
              <thead>
                <tr>
                  <th>Місце</th>
                  <th>Імʼя</th>
                  <th>Загальний рахунок</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  style={{
                    backgroundColor: "#d1e7dd",
                    fontWeight: "600",
                  }}
                >
                  <td>{currentUserRank + 1}</td>
                  <td>{currentUser.username}</td>
                  <td>{players[currentUserRank].totalScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>Ваш результат відсутній у таблиці кращих гравців.</p>
        )}
      </div>
    </div>
  );
}

export default TopPlayersPage;
