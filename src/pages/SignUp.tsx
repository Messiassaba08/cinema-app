import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../pages/login.css"; // Assumindo que você quer usar o mesmo CSS para ambos

// Interface para o tipo de usuário
interface User {
  email: string;
  password?: string;
}

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    if (email.trim() === "" || password.trim() === "") {
      setError("Por favor, preencha email e senha.");
      return;
    }

    // Carregar usuários existentes do localStorage
    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    // Verificar se o email já está cadastrado
    const emailExists = users.some((user) => user.email === email);

    if (emailExists) {
      setError(
        "Este email já está cadastrado. Tente fazer login ou use outro email."
      );
      return;
    }

    // Adicionar o novo usuário
    const newUser: User = { email, password }; // Em um app real, a senha seria hash
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users)); // Salva a lista atualizada

    alert("Conta criada com sucesso! Você já pode fazer login.");
    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="login">
        <h2>Criar Conta</h2>
        <form onSubmit={handleSignUp}>
          {/* MODIFICADO: Adicionado htmlFor e id para acessibilidade e testes */}
          <label htmlFor="signup-email-input">Email:</label>
          <br />
          <input
            id="signup-email-input" // Adicionado ID único para associação com a label
            type="email"
            className="input"
            placeholder="E-mail"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
          <br />
          <br />
          {/* MODIFICADO: Adicionado htmlFor e id para acessibilidade e testes */}
          <label htmlFor="signup-password-input">Senha:</label>
          <br />
          <input
            id="signup-password-input" // Adicionado ID único para associação com a label
            type="password"
            className="input"
            placeholder="Senha"
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
            Cadastrar
          </button>
        </form>
        <p>
          Já tem uma conta?{" "}
          <Link className="register" to="/login">
            Entrar
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default SignUp;