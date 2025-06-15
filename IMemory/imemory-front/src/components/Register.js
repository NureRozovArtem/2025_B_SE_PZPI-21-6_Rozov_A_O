import { useState } from "react";
import Header from "./Header";


function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    });

    if (res.ok) {
      setSuccess("Реєстрація успішна. Тепер увійдіть.");
    } else {
      setError("Помилка під час реєстрації");
    }
  };

  return (
     <div>
        <Header showTopBar={false} />

      <form onSubmit={handleSubmit}>
        <h2>Реєстрація</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ім’я користувача"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <button type="submit">Зареєструватися</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <p>
          Вже є акаунт?{" "}
          <button type="button" onClick={onSwitchToLogin}>
            Увійти
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
