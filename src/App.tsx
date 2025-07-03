import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { movies } from "./data/movies";
import SeatSelection from "./pages/SeatSelection";
import Login from "./pages/Login";
import "./App.css";
import DropdownMenu from "./pages/DropDownMenu";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";

// Interfaces para tipagem
export interface User {
  email: string;
  password?: string;
  isAdmin?: boolean; // Adicionada propriedade opcional de admin
}

export interface Ticket {
  movieId: number;
  movieTitle: string;
  seats: string[];
  purchaseDate: string;
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
}

export interface Ticket {
  movieId: number;
  movieTitle: string;
  seats: string[];
  purchaseDate: string;
}

const App: React.FC = () => {
  // Função para verificar o estado inicial do usuário
  const getInitialUserState = () => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      return { loggedIn: false, admin: false };
    }
    const user: User = JSON.parse(storedUser);
    return { loggedIn: true, admin: user.isAdmin === true };
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(getInitialUserState().loggedIn);
  // Estado para verificar se o usuário é admin
  const [isAdmin, setIsAdmin] = useState<boolean>(getInitialUserState().admin);

  const handleLogin = (): void => {
    const { loggedIn, admin } = getInitialUserState();
    setIsLoggedIn(loggedIn);
    setIsAdmin(admin); // Atualiza o estado de admin no login
  };

  const handleLogout = (): void => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setIsAdmin(false); // Reseta o estado de admin no logout
  };

  const handleCancelPurchase = (
    ticketToCancel: Ticket,
    userEmail: string
  ): void => {
    const userTicketsKey = `tickets_${userEmail}`;
    const storedUserTickets = localStorage.getItem(userTicketsKey);
    let existingTickets: Ticket[] = storedUserTickets
      ? JSON.parse(storedUserTickets)
      : [];

    const updatedUserTickets = existingTickets.filter(
      (ticket) =>
        !(
          ticket.movieId === ticketToCancel.movieId &&
          ticket.purchaseDate === ticketToCancel.purchaseDate &&
          JSON.stringify(ticket.seats) === JSON.stringify(ticketToCancel.seats)
        )
    );
    localStorage.setItem(userTicketsKey, JSON.stringify(updatedUserTickets));

    const occupiedSeatsKey = `occupiedSeats_movie_${ticketToCancel.movieId}`;
    const storedOccupiedSeats = localStorage.getItem(occupiedSeatsKey);
    let currentOccupiedSeats: string[] = storedOccupiedSeats
      ? JSON.parse(storedOccupiedSeats)
      : [];

    const releasedSeats = ticketToCancel.seats;
    const updatedOccupiedSeats = currentOccupiedSeats.filter(
      (seat) => !releasedSeats.includes(seat)
    );
    localStorage.setItem(
      occupiedSeatsKey,
      JSON.stringify(updatedOccupiedSeats)
    );

    alert("Compra cancelada e assentos liberados com sucesso!");
  };

  useEffect(() => {
    // Lógica atualizada para lidar com login/logout em outras abas
    const handleStorageChange = () => {
      const { loggedIn, admin } = getInitialUserState();
      setIsLoggedIn(loggedIn);
      setIsAdmin(admin);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <div className="menu-container">
        <div className="menu">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="logo" />
          </Link>
        </div>
        {}
        <DropdownMenu
          isLoggedIn={isLoggedIn}
          isAdminLoggedIn={isAdmin}
          onLogout={handleLogout}
        />
      </div>

      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<SignUp />} />

          {isLoggedIn ? (
            <Route
            path="/profile"
            element={
              <Profile
                onCancelPurchase={handleCancelPurchase}
                // Passe as funções do navegador como props
                localStorageGetItem={localStorage.getItem.bind(localStorage)}
                windowConfirm={window.confirm.bind(window)}
              />
            }
          />
          ) : (
           
            <Route path="/profile" element={<Navigate to="/login" replace />} />
          )}

          <Route
            path="/"
            element={
              <>
                <h1>Filmes em Cartaz</h1>
                <div className="carousel-container">
                  <button
                    className="arrow-button arrow-left"
                    onClick={() => {
                      document.getElementById("carousel")?.scrollBy({
                        left: -300,
                        behavior: "smooth",
                      });
                    }}
                  >
                    ‹
                  </button>
                  <div className="carousel-track" id="carousel" data-testid="carousel-track">
                    {movies.map((movie: Movie) => (
                      <div key={movie.id} className="movie-card">
                        <Link
                          to={`/movie/${movie.id}/seats`}
                          className="movie-link"
                        >
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            width="150"
                          />
                          <p
                            style={{
                              textAlign: "center",
                              marginTop: "8px",
                            }}
                          >
                            {movie.title}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <button
                    className="arrow-button arrow-right"
                    onClick={() => {
                      document.getElementById("carousel")?.scrollBy({
                        left: 300,
                        behavior: "smooth",
                      });
                    }}
                  >
                    ›
                  </button>
                </div>
              </>
            }
          />

          <Route
            path="/movie/:id/seats"
            element={
              <SeatSelection
                isLoggedIn={isLoggedIn}
                key={isLoggedIn.toString()}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default App;