import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { movies } from "./data/movies"; // Presumo que você tenha um arquivo de dados de filmes
import Site1 from "./pages/1_ticket";
import Site2 from "./pages/2_ticket";
import Site3 from "./pages/3_ticket";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Filmes em Cartaz</h1>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              {/* Transformar a imagem em link */}
              <Link to={`/movie/${movie.id}`} className="movie-link">
                <img src={movie.posterUrl} alt={movie.title} width="150" />
              </Link>

              {/* Transformar o nome em link */}
              <Link to={`/movie/${movie.id}`} className="movie-link">
                <p>{movie.title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Definindo as rotas para os filmes */}
      <Routes>
        <Route path="/movie/1" element={<Site1 />} />
        <Route path="/movie/2" element={<Site2 />} />
        <Route path="/movie/3" element={<Site3 />} />
      </Routes>
    </Router>
  );
}

export default App;
