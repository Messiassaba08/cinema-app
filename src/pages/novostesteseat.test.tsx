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
  beforeAll(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterAll(() => {
    (window.alert as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
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

});
