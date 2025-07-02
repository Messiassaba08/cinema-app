import React from "react";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SeatSelection from "./SeatSelection";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

const renderWithRouter = (ui: React.ReactElement, { route = "/seat/1" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/seat/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe("SeatSelection Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    mockedNavigate.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("exibe o título do filme e o botão de confirmação", () => {
    renderWithRouter(<SeatSelection isLoggedIn={true} />, { route: "/seat/1" });
    expect(screen.getByText(/Selecionar Assentos/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirmar assentos/i })
    ).toBeInTheDocument();
  });

  it("exibe mensagem de erro se id de filme for inválido", () => {
    renderWithRouter(<SeatSelection isLoggedIn={true} />, {
      route: "/seat/9999",
    });
    expect(screen.getByText(/filme não encontrado/i)).toBeInTheDocument();
  });

  it("não permite selecionar mais assentos se limite for atingido", () => {
    const email = "teste@email.com";
    const ticketsKey = `tickets_${email}`;
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ email })
    );
    localStorage.setItem(
      ticketsKey,
      JSON.stringify([
        { movieId: 1, movieTitle: "Test Movie", seats: ["A1", "A2"], purchaseDate: "01/01/2025" },
      ])
    );

    renderWithRouter(<SeatSelection isLoggedIn={true} />, { route: "/seat/1" });

    expect(
      screen.getByText(/Você já atingiu o limite de 2 ingressos para este filme./i)
    ).toBeInTheDocument();

    const seatA3 = screen.getByText("A3");
    fireEvent.click(seatA3);
    expect(seatA3.classList.contains("selected")).toBe(false);
  });

  it("redireciona para login se usuário não estiver logado e tenta confirmar", () => {
    renderWithRouter(<SeatSelection isLoggedIn={false} />, { route: "/seat/1" });
    fireEvent.click(screen.getByRole("button", { name: /confirmar assentos/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Você precisa estar logado para confirmar a compra."
    );
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });

  it("permite selecionar e confirmar um assento se dentro do limite", () => {
    const email = "user@example.com";
    localStorage.setItem("currentUser", JSON.stringify({ email }));

    renderWithRouter(<SeatSelection isLoggedIn={true} />, { route: "/seat/1" });

    const seatA1 = screen.getByText("A1");
    fireEvent.click(seatA1);
    expect(seatA1.classList.contains("selected")).toBe(true);

    const confirmBtn = screen.getByRole("button", { name: /confirmar assentos/i });
    fireEvent.click(confirmBtn);

    const ticketsKey = `tickets_${email}`;
    const tickets = JSON.parse(localStorage.getItem(ticketsKey) || "[]");
    expect(tickets.some((t: any) => t.seats.includes("A1"))).toBe(true);
  });

  it("mostra alerta se tenta comprar mais que limite permitido", () => {
    const email = "user2@example.com";
    const ticketsKey = `tickets_${email}`;

    localStorage.setItem("currentUser", JSON.stringify({ email }));
    localStorage.setItem(
      ticketsKey,
      JSON.stringify([{ movieId: 1, movieTitle: "Test Movie", seats: ["A1", "A2"], purchaseDate: "01/01/2025" }])
    );

    renderWithRouter(<SeatSelection isLoggedIn={true} />, { route: "/seat/1" });

    const seatA3 = screen.getByText("A3");
    fireEvent.click(seatA3);

    fireEvent.click(screen.getByRole("button", { name: /confirmar assentos/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Você já possui 2 ingresso(s) para este filme. Não é possível comprar mais que 2 no total."
    );
  });
  it("não permite selecionar assento ocupado", () => {
    const email = "test@ocupado.com";
    localStorage.setItem("currentUser", JSON.stringify({ email }));
  
    // Assento A1 já está ocupado no localStorage
    localStorage.setItem("occupiedSeats_movie_1", JSON.stringify(["A1"]));
  
    renderWithRouter(<SeatSelection isLoggedIn={true} />, { route: "/seat/1" });
  
    const seatA1 = screen.getByText("A1");
    fireEvent.click(seatA1);
  
    // Como está ocupado, não deve adicionar 'selected'
    expect(seatA1.classList.contains("selected")).toBe(false);
  });
  
  it("exibe alerta ao tentar confirmar sem assentos selecionados", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "empty@test.com" }));
  
    renderWithRouter(<SeatSelection isLoggedIn={true} />, { route: "/seat/1" });
  
    const confirmBtn = screen.getByRole("button", { name: /confirmar assentos/i });
    fireEvent.click(confirmBtn);
  
    expect(window.alert).toHaveBeenCalledWith("Por favor, selecione pelo menos um assento.");
  });
  
  it("exibe alerta e redireciona se não encontra usuário no localStorage", () => {
    renderWithRouter(<SeatSelection isLoggedIn={true} />, { route: "/seat/1" });
  
    // Força selectedSeats com clique
    const seatA2 = screen.getByText("A2");
    fireEvent.click(seatA2);
  
    const confirmBtn = screen.getByRole("button", { name: /confirmar assentos/i });
    fireEvent.click(confirmBtn);
  
    expect(window.alert).toHaveBeenCalledWith(
      "Erro: Usuário não logado. Por favor, faça login novamente."
    );
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
  
});
