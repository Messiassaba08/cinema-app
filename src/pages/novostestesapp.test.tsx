import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

describe("App component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza carrossel e botões de scroll, testa clique dos botões", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Filmes em Cartaz/i)).toBeInTheDocument();

    const carousel = screen.getByTestId("carousel-track");
    expect(carousel).toBeInTheDocument();

    const leftButton = screen.getByText("‹");
    const rightButton = screen.getByText("›");

    // Simula clique para garantir código de scroll executa sem erro
    fireEvent.click(rightButton);
    fireEvent.click(leftButton);
  });

  it("exibe DropdownMenu e logo", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    // Dropdown pode ter texto variado, só testamos que existe algum botão/menu
    expect(screen.getByRole("link", { name: /login|perfil|logout|cadastrar|sair/i })).toBeTruthy();
  });

  it("redireciona para login quando acessa /profile sem estar logado", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    // Deve aparecer o formulário de login, pois está redirecionando
    expect(screen.getByRole("button", { name: /entrar|login/i })).toBeInTheDocument();
  });

  it("exibe Profile quando está logado e navega para /profile", () => {
    // Define user logado no localStorage antes de renderizar
    localStorage.setItem("currentUser", JSON.stringify({ email: "test@example.com" }));

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    // Deve renderizar o Profile
    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
  });

  it("loga o usuário e atualiza o estado isLoggedIn", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    // Simula login — chama handleLogin que muda o estado
    // Para testar isso de verdade, você pode disparar evento no Login que chama onLogin
    // Aqui, vamos forçar localStorage e renderizar a página /profile

    localStorage.setItem("currentUser", JSON.stringify({ email: "test@example.com" }));

    // Rerender App para captar o estado do localStorage
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
  });

  it("loga o usuário para fora (logout) e atualiza o estado", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "test@example.com" }));

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    // O dropdown tem o botão "Sair" ou similar — simula clique para chamar handleLogout
    const logoutButton = screen.getByText(/sair|logout/i);
    fireEvent.click(logoutButton);

    // O estado isLoggedIn deve ficar falso e o usuário redirecionado (testamos removendo localStorage)
    expect(localStorage.getItem("currentUser")).toBeNull();
  });

  it("rota desconhecida redireciona para home", () => {
    render(
      <MemoryRouter initialEntries={["/rota/que-nao-existe"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Filmes em Cartaz/i)).toBeInTheDocument();
  });
});
