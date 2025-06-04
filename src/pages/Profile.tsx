import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

// Interfaces para User e Ticket (devem ser consistentes com App.tsx e SeatSelection.tsx)
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
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para carregar ingressos do usuário
  const loadUserTickets = (userEmail: string) => {
    const storedTickets = localStorage.getItem(`tickets_${userEmail}`);
    if (storedTickets) {
      setUserTickets(JSON.parse(storedTickets));
    } else {
      setUserTickets([]); // Se não houver, define como array vazio
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      setCurrentUser(user);
      loadUserTickets(user.email); // Carrega os ingressos assim que o usuário é definido
    } else {
      // Se não houver usuário logado, redireciona para o login
      navigate("/login");
    }
    setLoading(false); // Define loading como false após tentar carregar o usuário
  }, [navigate]);

  // UseEffect para ouvir mudanças no localStorage (ex: cancelamento em outra aba/janela)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Verifica se a chave alterada é a dos tickets do usuário atual
      if (currentUser && e.key === `tickets_${currentUser.email}`) {
        loadUserTickets(currentUser.email);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentUser]); // Depende de currentUser para saber qual chave ouvir

  const handleCancelClick = (ticket: Ticket) => {
    if (
      currentUser &&
      window.confirm("Tem certeza que deseja cancelar esta compra?")
    ) {
      onCancelPurchase(ticket, currentUser.email);
      // Atualizar a lista de ingressos localmente após o cancelamento
      // Isso garante que a UI se atualize sem precisar de uma recarga completa da página
      setUserTickets((prevTickets) =>
        prevTickets.filter(
          (t) =>
            !(
              t.movieId === ticket.movieId &&
              t.purchaseDate === ticket.purchaseDate &&
              JSON.stringify(t.seats) === JSON.stringify(ticket.seats)
            )
        )
      );
    }
  };

  if (loading) {
    return <div className="profile-container">Carregando perfil...</div>;
  }

  if (!currentUser) {
    return null; // Será redirecionado pelo useEffect anterior
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Informações do Perfil</h2>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        {/* Adicione outras informações do usuário aqui, se houver */}
      </div>

      <div className="tickets-section">
        <h3>Meus Ingressos Comprados</h3>
        {userTickets.length === 0 ? (
          <p>Você ainda não comprou nenhum ingresso.</p>
        ) : (
          <div className="tickets-grid">
            {userTickets.map((ticket, index) => (
              <div key={index} className="ticket-card">
                <h4>{ticket.movieTitle}</h4>
                <p>
                  <strong>Assentos:</strong> {ticket.seats.join(", ")}
                </p>
                <p>
                  <strong>Data da Compra:</strong> {ticket.purchaseDate}
                </p>
                <button
                  onClick={() => handleCancelClick(ticket)}
                  className="cancel-button"
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
