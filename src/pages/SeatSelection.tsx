import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies, Movie } from "../data/movies"; // Certifique-se de que a interface Movie é exportada aqui
import "./SeatSelection.css";

const ROWS = 5;
const COLS = 8;
const TOTAL_SEATS = ROWS * COLS;
const MAX_TICKETS_PER_MOVIE = 2; // Definindo o limite máximo de ingressos

// Interfaces para User e Ticket (melhor definidas em um arquivo de tipos global)
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

  // Função para carregar assentos ocupados e ingressos do usuário
  const loadSeatAndTicketData = () => {
    // Carregar assentos ocupados para este filme
    const storedOccupiedSeats = localStorage.getItem(
      `occupiedSeats_movie_${id}`
    );
    if (storedOccupiedSeats) {
      setOccupiedSeats(JSON.parse(storedOccupiedSeats));
    } else {
      setOccupiedSeats([]); // Reseta se não houver
    }

    // Carregar contagem de ingressos do usuário para este filme
    if (isLoggedIn && movie) {
      // Só verifica se o usuário está logado e o filme é válido
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
        setUserTicketsForThisMovie(0); // Se não houver currentUser, não há ingressos comprados
      }
    } else {
      setUserTicketsForThisMovie(0); // Se não estiver logado, não há ingressos comprados
    }
    // Sempre limpa os assentos selecionados ao recarregar os dados, para evitar estado inconsistente
    setSelectedSeats([]);
  };

  // Este useEffect será executado na montagem/remontagem e quando suas dependências mudam
  // A 'key' em App.tsx garante a remontagem quando isLoggedIn muda.
  useEffect(() => {
    loadSeatAndTicketData();
    // O listener 'storage' para este componente é removido pois a 'key' em App.tsx já força a remontagem.
  }, [id, isLoggedIn, movie]); // Depende de id, isLoggedIn e movie (para o movie.id)

  if (!movie) return <p>Filme não encontrado</p>;

  const toggleSeat = (seat: string): void => {
    if (occupiedSeats.includes(seat)) {
      return; // Não permite selecionar assento ocupado
    }

    // Se o assento já estiver selecionado, permite desselecionar
    if (selectedSeats.includes(seat)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seat));
    } else {
      // Se o assento NÃO estiver selecionado e adicioná-lo exceder o limite, impede
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

    // Validação final antes de confirmar, usando a contagem atualizada
    if (
      userTicketsForThisMovie + selectedSeats.length >
      MAX_TICKETS_PER_MOVIE
    ) {
      alert(
        `Você já possui ${userTicketsForThisMovie} ingresso(s) para este filme. Não é possível comprar mais que ${MAX_TICKETS_PER_MOVIE} no total.`
      );
      // Recarrega os dados para garantir que a UI reflita o estado correto
      loadSeatAndTicketData();
      return;
    }

    // Lógica de atualização de assentos ocupados e salvamento de ingressos
    const newOccupiedSeats = [...occupiedSeats, ...selectedSeats];
    localStorage.setItem(
      `occupiedSeats_movie_${id}`,
      JSON.stringify(newOccupiedSeats)
    );
    setOccupiedSeats(newOccupiedSeats); // Atualiza o estado local para assentos ocupados

    const newTicket: Ticket = {
      movieId: movie!.id, // Usamos '!' pois já verificamos se movie existe
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
    setSelectedSeats([]); // Limpa a seleção atual
    // Atualiza a contagem local de ingressos para este filme IMEDIATAMENTE após a compra
    setUserTicketsForThisMovie((prevCount) => prevCount + selectedSeats.length);
  };

  return (
    <div className="seat-page">
      <h1>Selecionar Assentos - {movie?.title}</h1>{" "}
      {/* Use movie?.title para segurança */}
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
          // Determina se o assento está desabilitado (ocupado ou excedendo o limite)
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
              onClick={() => !isDisabled && toggleSeat(seat)} // Só permite clique se não estiver desabilitado
            >
              {seat}
            </div>
          );
        })}
      </div>
      <button
        onClick={handleConfirm}
        className="confirm-button"
        // CORREÇÃO AQUI: A condição de 'disabled' do botão de confirmação está correta
        // Verifica se não há assentos selecionados OU se a compra excede o limite.
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
