import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ showTopBar, setShowProfile, setShowInfo }) {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="left-side">
        <img src="/mylogo.png" alt="Логотип" className="logo" />
        <span className="site-name">iMemory</span>
      </div>

      {showTopBar && (
        <div className="top-bar">
          <button className="profile-button" onClick={() => setShowProfile(true)}>👤 Профіль</button>
          <button className="top-players-button" onClick={() => navigate("/top-players")}>🏆 Кращі гравці</button>
          <button className="info-button" onClick={() => setShowInfo(true)}>ℹ️ Інформація</button>
        </div>
      )}
    </header>
  );
}

export default Header;
