import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies, Movie } from "../data/movies";
import "./SeatSelection.css";

const ROWS = 5;
const COLS = 8;
const TOTAL_SEATS = ROWS * COLS;
const MAX_TICKETS_PER_MOVIE = 2;

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

interface SeatSelectionProps {
  isLoggedIn: boolean;
}

function SeatSelection({ isLoggedIn }: SeatSelectionProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie: Movie | undefined = movies.find((m) => m.id.toString() === id);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [userTicketsForThisMovie, setUserTicketsForThisMovie] =
    useState<number>(0);

  const loadSeatAndTicketData = () => {
    const storedOccupiedSeats = localStorage.getItem(
      `occupiedSeats_movie_${id}`
    );
    if (storedOccupiedSeats) {
      setOccupiedSeats(JSON.parse(storedOccupiedSeats));
    } else {
      setOccupiedSeats([]);
    }

    if (isLoggedIn && movie) {
      const currentUserString = localStorage.getItem("currentUser");
      if (currentUserString) {
        const currentUser: User = JSON.parse(currentUserString);
        const userTicketsKey = `tickets_${currentUser.email}`;
        const storedUserTickets = localStorage.getItem(userTicketsKey);
        const existingTickets: Ticket[] = storedUserTickets
          ? JSON.parse(storedUserTickets)
          : [];

        const count = existingTickets.filter(
          (ticket) => ticket.movieId === movie.id
        ).length;
        setUserTicketsForThisMovie(count);
      } else {
        setUserTicketsForThisMovie(0);
      }
    } else {
      setUserTicketsForThisMovie(0);
    }
    setSelectedSeats([]);
  };

  useEffect(() => {
    loadSeatAndTicketData();
  }, [id, isLoggedIn, movie]);

  if (!movie) return <p>Filme não encontrado</p>;

  const toggleSeat = (seat: string): void => {
    if (occupiedSeats.includes(seat)) {
      return;
    }

    if (selectedSeats.includes(seat)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seat));
    } else {
      if (
        userTicketsForThisMovie + selectedSeats.length >=
        MAX_TICKETS_PER_MOVIE
      ) {
        alert(
          `Você pode selecionar no máximo ${
            MAX_TICKETS_PER_MOVIE - userTicketsForThisMovie
          } assento(s) adicional(is) para este filme.`
        );
        return;
      }
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const handleConfirm = (): void => {
    if (!isLoggedIn) {
      alert("Você precisa estar logado para confirmar a compra.");
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Por favor, selecione pelo menos um assento.");
      return;
    }

    const currentUserString = localStorage.getItem("currentUser");
    if (!currentUserString) {
      alert("Erro: Usuário não logado. Por favor, faça login novamente.");
      navigate("/login");
      return;
    }
    const currentUser: User = JSON.parse(currentUserString);

    if (
      userTicketsForThisMovie + selectedSeats.length >
      MAX_TICKETS_PER_MOVIE
    ) {
      alert(
        `Você já possui ${userTicketsForThisMovie} ingresso(s) para este filme. Não é possível comprar mais que ${MAX_TICKETS_PER_MOVIE} no total.`
      );
      loadSeatAndTicketData();
      return;
    }

    const newOccupiedSeats = [...occupiedSeats, ...selectedSeats];
    localStorage.setItem(
      `occupiedSeats_movie_${id}`,
      JSON.stringify(newOccupiedSeats)
    );
    setOccupiedSeats(newOccupiedSeats);

    const newTicket: Ticket = {
      movieId: movie!.id,
      movieTitle: movie!.title,
      seats: selectedSeats,
      purchaseDate: new Date().toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const userTicketsKey = `tickets_${currentUser.email}`;
    const storedUserTickets = localStorage.getItem(userTicketsKey);
    const existingTickets: Ticket[] = storedUserTickets
      ? JSON.parse(storedUserTickets)
      : [];
    existingTickets.push(newTicket);
    localStorage.setItem(userTicketsKey, JSON.stringify(existingTickets));

    alert(
      `Assentos selecionados: ${selectedSeats.join(", ")}. Compra confirmada!`
    );
    setSelectedSeats([]);
    setUserTicketsForThisMovie((prevCount) => prevCount + selectedSeats.length);
  };

  return (
    <div className="seat-page">
      <h1>Selecionar Assentos - {movie?.title}</h1>
      {isLoggedIn && userTicketsForThisMovie >= MAX_TICKETS_PER_MOVIE && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Você já atingiu o limite de {MAX_TICKETS_PER_MOVIE} ingressos para
          este filme.
        </p>
      )}
      {isLoggedIn && userTicketsForThisMovie < MAX_TICKETS_PER_MOVIE && (
        <p>
          Você pode selecionar mais{" "}
          {MAX_TICKETS_PER_MOVIE - userTicketsForThisMovie} assento(s)
          adicional(is) para este filme.
        </p>
      )}
      <button onClick={() => navigate("/")} className="back-button">
        ← Voltar para filmes
      </button>
      <div className="screen">Tela</div>
      <div className="seat-grid">
        {Array.from({ length: TOTAL_SEATS }, (_, i) => {
          const seat = `A${i + 1}`;
          const isSelected = selectedSeats.includes(seat);
          const isOccupied = occupiedSeats.includes(seat);
          const isDisabled =
            isOccupied ||
            (!isSelected &&
              userTicketsForThisMovie + selectedSeats.length >=
                MAX_TICKETS_PER_MOVIE);

          return (
            <div
              key={seat}
              className={`seat ${isSelected ? "selected" : ""} ${
                isOccupied ? "occupied" : ""
              } ${isDisabled ? "disabled" : ""}`}
              onClick={() => !isDisabled && toggleSeat(seat)}
            >
              {seat}
            </div>
          );
        })}
      </div>
      <button
        onClick={handleConfirm}
        className="confirm-button"
        disabled={
          selectedSeats.length === 0 ||
          (isLoggedIn &&
            userTicketsForThisMovie + selectedSeats.length >
              MAX_TICKETS_PER_MOVIE)
        }
      >
        Confirmar Assentos
      </button>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div className="seat-legend available"></div>
          <span>Disponível</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div className="seat-legend selected"></div>
          <span>Selecionado</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div className="seat-legend occupied"></div>
          <span>Ocupado</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div className="seat-legend disabled"></div>
          <span>Limite Atingido</span>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
