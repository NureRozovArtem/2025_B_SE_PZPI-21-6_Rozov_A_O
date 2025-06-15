import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import LeaderboardPage from "./components/TopPlayersPage"; 
import Header from "./components/Header";
import './styles.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => setLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setMessage("");
  };

  return (
    <BrowserRouter>
      <Routes>
        {!loggedIn ? (
          showRegister ? (
            <Route path="*" element={<Register onSwitchToLogin={() => setShowRegister(false)} />} />
          ) : (
            <Route path="*" element={<Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />} />
          )
        ) : (
          <>
            <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
            <Route path="/top-players" element={<LeaderboardPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
