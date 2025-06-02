import React, { useState } from "react";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <div className="menu-container">
        <div className="menu">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>
        <DropdownMenu isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      </div>

      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {!isLoggedIn ? (
            <Route path="*" element={<Navigate to="/login" />} />
          ) : (
            <>
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
                        {movies.map((movie) => (
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

              <Route path="/movie/:id/seats" element={<SeatSelection />} />

              {/* Redirecionar qualquer outra rota para home */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
