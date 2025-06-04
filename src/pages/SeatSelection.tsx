import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies } from "../data/movies";
import "./SeatSelection.css";

const ROWS = 5;
const COLS = 8;

function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => m.id.toString() === id);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  if (!movie) return <p>Filme não encontrado</p>;

  const toggleSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleConfirm = () => {
    alert(`Assentos selecionados: ${selectedSeats.join(", ")}`);
    navigate("/");
  };

  return (
    <div className="seat-page">
      <h1>Selecionar Assentos - {movie.title}</h1>

      {/* Botão de Voltar */}
      <button onClick={() => navigate("/")} className="back-button">
        ← Voltar para filmes
      </button>

      <div className="screen">Tela</div>
        <div className="seat-grid">
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const seat = `A${i + 1}`;
            return (
              <div
                key={seat}
                className={`seat ${
                  selectedSeats.includes(seat) ? "selected" : ""
                }`}
                onClick={() => toggleSeat(seat)}
              >
                {seat}
              </div>
            );
          })}
        </div>

        <button onClick={handleConfirm} className="confirm-button">
          Confirmar Assentos
        </button>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#00a00d", borderRadius: "4px" }}></div>
            <span>Disponível</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#ffcc00", borderRadius: "4px" }}></div>
            <span>Selecionado</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", backgroundColor: "#e74c3c", borderRadius: "4px" }}></div>
            <span>Ocupado</span>
          </div>
        </div>
    </div>
  );
}

export default SeatSelection;
