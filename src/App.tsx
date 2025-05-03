import React from "react";
import "./App.css";
import { movies } from "./data/movies";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Filmes em Cartaz</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ textAlign: "center" }}>
            <img src={movie.posterUrl} alt={movie.title} width="150" />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
