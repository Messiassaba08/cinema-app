import React, { useState } from "react";
import "../pages/login.css";
import { useNavigate, Link } from "react-router-dom";

// Interface para o tipo de usuário
interface User {
  email: string;
  password?: string;
}

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    if (email.trim() === "" || password.trim() === "") {
      setError("Por favor, preencha email e senha.");
      return;
    }

    // Carregar usuários do localStorage
    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    // Encontrar o usuário com o email e senha correspondentes
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      // Login bem-sucedido
      localStorage.setItem("currentUser", JSON.stringify(foundUser)); // Salva o usuário logado
      onLogin(); // Atualiza o estado de login no App
      navigate("/"); // Redireciona para a página principal
    } else {
      // Login falhou
      setError(
        "Email ou senha inválidos. Verifique suas credenciais ou crie uma conta."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {/* MODIFICADO: Adicionado htmlFor e id para acessibilidade e testes */}
          <label htmlFor="email-input">Email:</label>
          <br />
          <input
            id="email-input" // Adicionado ID para associação com a label
            type="email"
            className="input"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <br />
          <br />
          {/* MODIFICADO: Adicionado htmlFor e id para acessibilidade e testes */}
          <label htmlFor="password-input">Senha:</label>
          <br />
          <input
            id="password-input" // Adicionado ID para associação com a label
            type="password"
            className="input"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          <br />
          <br />
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button className="button" type="submit">
            Entrar
          </button>
        </form>
        <p>
          Não tem uma conta?{" "}
          <Link className="register" to="/register">
            Criar Conta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;