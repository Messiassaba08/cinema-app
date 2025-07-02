// coverage.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("App Component Coverage Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("redireciona para login se acessar /profile sem login", async () => {
    window.history.pushState({}, "", "/profile");
    render(<App />);
    expect(await screen.findByText(/Login/i)).toBeInTheDocument();
  });

  test("realiza login com sucesso", async () => {
    const mockUser = { email: "user@test.com", password: "123" };
    localStorage.setItem("users", JSON.stringify([mockUser]));
    window.history.pushState({}, "", "/login");
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: mockUser.email },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: mockUser.password },
    });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    expect(await screen.findByAltText("Menu")).toBeInTheDocument();
  });

  test("exibe e fecha o menu dropdown", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@test.com" }));
    render(<App />);
    const icon = await screen.findByAltText("Menu");
    fireEvent.click(icon);
    expect(screen.getByText("Perfil")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Perfil"));
  });

  test("botão de logout limpa o localStorage", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "logout@test.com" }));
    render(<App />);
    const icon = await screen.findByAltText("Menu");
    fireEvent.click(icon);
    fireEvent.click(screen.getByText("Sair"));
    expect(localStorage.getItem("currentUser")).toBeNull();
  });

  test("renderiza botão de voltar na seleção de assentos", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@test.com" }));
    window.history.pushState({}, "", "/movie/1/seats");
    render(<App />);
    expect(await screen.findByRole("button", { name: /Voltar/i })).toBeInTheDocument();
  });

  test("não permite confirmar sem assentos selecionados", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@test.com" }));
    window.history.pushState({}, "", "/movie/1/seats");
    render(<App />);
    const button = await screen.findByRole("button", { name: /Confirmar Assentos/i });
    expect(button).toBeDisabled();
  });

  test("impede seleção de assento ocupado", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "occupied@test.com" }));
    localStorage.setItem("occupiedSeats_movie_1", JSON.stringify(["A1"]));
    window.history.pushState({}, "", "/movie/1/seats");
    render(<App />);
    const seat = await screen.findByText("A1");
    fireEvent.click(seat);
    expect(seat).toHaveClass("occupied");
  });

  test("exibe mensagem quando limite de ingressos é atingido", async () => {
    const ticket = {
      movieId: 1,
      movieTitle: "Teste",
      seats: ["A1"],
      purchaseDate: new Date().toLocaleString(),
    };
    localStorage.setItem("currentUser", JSON.stringify({ email: "limit@test.com" }));
    localStorage.setItem("tickets_limit@test.com", JSON.stringify([ticket, ticket]));
    window.history.pushState({}, "", "/movie/1/seats");
    render(<App />);
    expect(await screen.findByText(/limite de 2 ingressos/i)).toBeInTheDocument();
  });

  test("redireciona para rota inexistente para página principal", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@test.com" }));
    window.history.pushState({}, "", "/nao-existe");
    render(<App />);
    expect(await screen.findByAltText("Menu")).toBeInTheDocument();
  });

  test("renderiza tela de cadastro ao acessar /register", async () => {
    window.history.pushState({}, "", "/register");
    render(<App />);
    expect(await screen.findByText("Criar Conta")).toBeInTheDocument();
  });

  test("abre e fecha dropdown sem estar logado (Login/Criar Conta)", async () => {
    render(<App />);
    const icon = await screen.findByAltText("Menu");
    fireEvent.click(icon);
    expect(screen.getByText("Login")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Login"));
  });

  test("executa seleção e desseleção de assento disponível", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "select@test.com" }));
    window.history.pushState({}, "", "/movie/1/seats");
    render(<App />);
    const seat = await screen.findByText("A2");
    fireEvent.click(seat);
    expect(seat).toHaveClass("selected");
    fireEvent.click(seat);
    expect(seat).not.toHaveClass("selected");
  });
});
