import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

// Interfaces (mantidas consistentes)
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

interface ProfileProps {
  onCancelPurchase: (ticket: Ticket, userEmail: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onCancelPurchase }) => {
  const navigate = useNavigate(); // useNavigate está sendo mockado no teste
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para carregar ingressos do usuário do localStorage
  const loadUserTickets = (userEmail: string) => {
    const userTicketsKey = `tickets_${userEmail}`;
    const storedTickets = localStorage.getItem(userTicketsKey);
    const newTickets: Ticket[] = storedTickets
      ? JSON.parse(storedTickets)
      : [];

    if (JSON.stringify(newTickets) !== JSON.stringify(userTickets)) {
      setUserTickets(newTickets);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      setCurrentUser(user);
      loadUserTickets(user.email);
    } else {
      // Quando localStorage.getItem('currentUser') é null, navigate('/login') é chamado.
      // Em testes de unidade, useNavigate é mockado, então não há erro real, apenas a chamada é verificada.
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  // UseEffect para ouvir mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (currentUser && e.key === `tickets_${currentUser.email}`) {
        loadUserTickets(currentUser.email);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentUser, userTickets]);

  const handleCancelClick = (ticketToCancel: Ticket) => {
    if (
      currentUser &&
      window.confirm("Tem certeza que deseja cancelar esta compra?")
    ) {
      onCancelPurchase(ticketToCancel, currentUser.email);
    }
  };

  // Renderização condicional para estado de carregamento
  if (loading) {
    return <div data-testid="profile-loading" className="profile-container">Carregando perfil...</div>;
  }

  // Renderização condicional para usuário não logado (redirecionado por useEffect)
  if (!currentUser) {
    return null; // O navigate já foi chamado, então não renderiza nada
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Informações do Perfil</h2>
        <p>
          <strong>Email:</strong>{" "}
          <span data-testid="profile-email">{currentUser.email}</span>
        </p>
        {/* Adicione outras informações do usuário aqui, se houver */}
      </div>

      <div className="tickets-section">
        <h3>Meus Ingressos Comprados</h3>
        {userTickets.length === 0 ? (
          <p data-testid="no-tickets-message">Você ainda não comprou nenhum ingresso.</p>
        ) : (
          <div className="tickets-grid">
            {userTickets.map((ticket, index) => (
              <div key={index} className="ticket-card">
                <h4 data-testid={`ticket-title-${ticket.movieId}`}>{ticket.movieTitle}</h4>
                <p>
                  <strong>Assentos:</strong>{" "}
                  <span data-testid={`ticket-seats-${ticket.movieId}`}>
                    {ticket.seats.join(", ")}
                  </span>
                </p>
                <p>
                  <strong>Data da Compra:</strong>{" "}
                  <span data-testid={`ticket-purchase-date-${ticket.movieId}`}>
                    {ticket.purchaseDate}
                  </span>
                </p>
                <button
                  onClick={() => handleCancelClick(ticket)}
                  className="cancel-button"
                  data-testid={`cancel-button-${ticket.movieId}`}
                >
                  Cancelar Compra
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;