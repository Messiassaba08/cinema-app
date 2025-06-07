import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { movies } from "./data/movies";
import SeatSelection from "./pages/SeatSelection";
import Login from "./pages/Login";
import "./App.css";
import DropdownMenu from "./pages/DropDownMenu";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";

interface User {
  email: string;
  password?: string;
}

interface Ticket {
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("currentUser") !== null;
  });

  const handleLogin = (): void => {
    setIsLoggedIn(true);
  };

  const handleLogout = (): void => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
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
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("currentUser") !== null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div className="menu-container">
        <div className="menu">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="logo" />
          </Link>
        </div>
        {/* MODIFICAÇÃO: Coerção de tipo para resolver o erro TS2741 */}
        <DropdownMenu
          {...({
            isLoggedIn: isLoggedIn,
            onLogout: handleLogout,
          } as React.ComponentProps<typeof DropdownMenu>)}
        />
      </div>

      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<SignUp />} />

          {isLoggedIn ? (
            <Route
              path="/profile"
              element={<Profile onCancelPurchase={handleCancelPurchase} />}
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

                  <div className="carousel-track" id="carousel">
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
    </Router>
  );
}

export default App;