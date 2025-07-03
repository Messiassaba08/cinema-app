import React from "react";
// CORREÇÃO: Adicionando 'waitFor' para lidar com testes assíncronos
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import App from "../App";
import { MemoryRouter } from "react-router-dom";

// Mocks das páginas para isolar o componente App
jest.mock("../pages/Login", () => (props: any) => (
  <div>
    Login Mock
    <button onClick={props.onLogin}>Log In</button>
  </div>
));

jest.mock("../pages/SignUp", () => () => <div>SignUp Mock</div>);

jest.mock("../pages/Profile", () => (props: any) => (
  <div>
    Profile Mock
    <button
      onClick={() =>
        props.onCancelPurchase(
          {
            movieId: 1,
            movieTitle: "Fake Movie",
            seats: ["A1", "A2"],
            purchaseDate: "2023-01-01",
          },
          "user@example.com"
        )
      }
    >
      Cancel Purchase
    </button>
  </div>
));

jest.mock("../pages/SeatSelection", () => (props: any) => (
  <div>SeatSelection Mock - LoggedIn: {props.isLoggedIn ? "Yes" : "No"}</div>
));

jest.mock("../pages/DropDownMenu", () => (props: any) => (
  <div>
    DropdownMenu Mock
    {props.isLoggedIn ? (
      <button onClick={props.onLogout} data-testid="logout-btn">Logout</button>
    ) : (
      <span>Not logged in</span>
    )}
  </div>
));

describe("App component - isolated logic", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders homepage with carousel and navigates", () => {
    const scrollByMock = jest.fn();
    jest.spyOn(document, "getElementById").mockReturnValue({
      scrollBy: scrollByMock,
    } as any);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Filmes em Cartaz")).toBeInTheDocument();

    const rightArrow = screen.getByText("›");
    fireEvent.click(rightArrow);
    expect(scrollByMock).toHaveBeenCalledWith({ left: 300, behavior: "smooth" });
  });

  it("shows login page when not authenticated on /profile", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Login Mock")).toBeInTheDocument();
  });

  it("shows profile when authenticated on /profile", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Profile Mock")).toBeInTheDocument();
  });

  it("shows SeatSelection when authenticated on /movie/1/seats", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));

    render(
      <MemoryRouter initialEntries={["/movie/1/seats"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/SeatSelection Mock/)).toBeInTheDocument();
  });

  // CORREÇÃO: Teste agora é assíncrono e usa 'waitFor'
  it("responds to login state changes via storage event", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Not logged in")).toBeInTheDocument();

    act(() => {
      // Seta o usuário no localStorage ANTES de disparar o evento
      localStorage.setItem("currentUser", JSON.stringify({ email: "test@example.com" }));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "currentUser",
          newValue: JSON.stringify({ email: "test@example.com" }),
        })
      );
    });
    
    // Espera a UI ser atualizada
    await waitFor(() => {
        expect(screen.getByTestId("logout-btn")).toBeInTheDocument();
    });
  });

  it("calls logout and updates state", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("logout-btn"));
    expect(localStorage.getItem("currentUser")).toBeNull();
    expect(screen.getByText("Not logged in")).toBeInTheDocument();
  });

  it("cancels ticket and removes seats", () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));
    localStorage.setItem(
      "tickets_user@example.com",
      JSON.stringify([
        {
          movieId: 1,
          movieTitle: "Fake Movie",
          seats: ["A1", "A2"],
          purchaseDate: "2023-01-01",
        },
      ])
    );
    localStorage.setItem(
      "occupiedSeats_movie_1",
      JSON.stringify(["A1", "A2"])
    );

    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Cancel Purchase"));

    const updatedTickets = localStorage.getItem("tickets_user@example.com");
    const updatedSeats = localStorage.getItem("occupiedSeats_movie_1");

    expect(updatedTickets).toEqual(JSON.stringify([]));
    expect(updatedSeats).toEqual(JSON.stringify([]));
    expect(window.alert).toHaveBeenCalledWith(
      "Compra cancelada e assentos liberados com sucesso!"
    );
  });
  
  // CORREÇÃO: Teste agora é assíncrono e usa 'waitFor'
  it("responds to logout state changes via storage event", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ email: "user@example.com" }));

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("logout-btn")).toBeInTheDocument();

    act(() => {
      // Remove o usuário do localStorage ANTES de disparar o evento
      localStorage.removeItem("currentUser");
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "currentUser",
          newValue: null,
        })
      );
    });

    // Espera a UI ser atualizada
    await waitFor(() => {
        expect(screen.getByText("Not logged in")).toBeInTheDocument();
        expect(screen.queryByTestId("logout-btn")).not.toBeInTheDocument();
    });
  });

  it("handles carousel button clicks gracefully if the carousel element is missing", () => {
    const getElementByIdSpy = jest
      .spyOn(document, "getElementById")
      .mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const rightArrow = screen.getByText("›");
    
    expect(() => {
      fireEvent.click(rightArrow);
    }).not.toThrow();
    
    expect(getElementByIdSpy).toHaveBeenCalledWith("carousel");
  });
});