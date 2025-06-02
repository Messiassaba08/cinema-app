import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { movies } from "./data/movies";
import Site1 from "./pages/1_ticket";
import Site2 from "./pages/2_ticket";
import Site3 from "./pages/3_ticket";
import SeatSelection from "./pages/SeatSelection";
import "./App.css";
import DropdownMenu from "./DropDownMenu";

function Home() {
  return (
    <div className="app-container">
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
              <Link to={`/movie/${movie.id}/seats`} className="movie-link">
                <img src={movie.posterUrl} alt={movie.title} width="150" />
                <p style={{ textAlign: "center", marginTop: "8px" }}>
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
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="menu-container">
        <div className="menu">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>
        <DropdownMenu isLoggedIn={isLoggedIn} />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/1" element={<Site1 />} />
        <Route path="/movie/2" element={<Site2 />} />
        <Route path="/movie/3" element={<Site3 />} />
        <Route path="/movie/:id/seats" element={<SeatSelection />} />
      </Routes>
    </Router>
  );
}

export default App;
