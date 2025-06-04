import React, { useState } from "react";
import "../pages/login.css"
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setError("Por favor, preencha email e senha.");
      return;
    }

    onLogin(); // Atualiza o estado do login no App
    navigate("/"); // Redireciona para página principal
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <br />
          <input
            type="email" 
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <br />
          <label>Senha:</label>
          <br />
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <br />
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button className="button" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
