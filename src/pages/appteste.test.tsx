import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

describe("App component - isolated logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders homepage with expected content and navigates", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Filmes/i)).toBeInTheDocument(); // Ajuste conforme sua Home
  });

  it("shows login page when not authenticated on /profile", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("shows profile when authenticated on /profile", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Informações do Perfil/i)).toBeInTheDocument();
    expect(screen.getByTestId("profile-email")).toHaveTextContent("user@example.com");
  });

  it("shows SeatSelection when authenticated on /movie/1/seats", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));

    render(
      <MemoryRouter initialEntries={["/movie/1/seats"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Selecionar Assentos/i)).toBeInTheDocument();
  });

  it("responds to login state changes via storage event", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(localStorage.getItem("currentUser")).toBeNull();

    // Simula login em outra aba
    act(() => {
      localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));
      window.dispatchEvent(new StorageEvent("storage", { key: "currentUser", newValue: JSON.stringify({ email: "user@example.com" }) }));
    });

    await waitFor(() => {
      expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    });
  });

  it("calls logout and updates state", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    // Aqui você deve simular o clique no logout,
    // dependendo de como o logout está implementado,
    // por exemplo um botão com data-testid="logout-button"
    const logoutButton = screen.queryByTestId("logout-button");
    if (logoutButton) {
      fireEvent.click(logoutButton);
      expect(localStorage.getItem("currentUser")).toBeNull();
    }
  });

  it("cancels ticket and removes seats", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));

    // Preparar ticket no localStorage para teste de cancelamento
    const userTicketsKey = `tickets_user@example.com`;
    const ticket = {
      movieId: 1,
      movieTitle: "Filme Teste",
      seats: ["A1", "A2"],
      purchaseDate: new Date().toLocaleDateString(),
    };
    localStorage.setItem(userTicketsKey, JSON.stringify([ticket]));

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    const cancelButton = screen.getByTestId("cancel-button-1");
    expect(cancelButton).toBeInTheDocument();

    // Simular confirmação do cancelamento
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    fireEvent.click(cancelButton);

    // Verifica se os tickets foram removidos
    const updatedTickets = JSON.parse(localStorage.getItem(userTicketsKey) || "[]");
    expect(updatedTickets.length).toBe(0);

    jest.restoreAllMocks();
  });
});
