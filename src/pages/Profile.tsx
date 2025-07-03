// Em seu arquivo: src/pages/Profile.tsx

import React, { useState, useEffect } from 'react';
import { User, Ticket } from '../App'; // Importe as interfaces

// Props que o componente vai receber, incluindo as dependências
interface ProfileProps {
  onCancelPurchase: (ticket: Ticket, userEmail: string) => void;
  // Injeção das APIs do navegador para facilitar os testes
  localStorageGetItem: (key: string) => string | null;
  windowConfirm: (message?: string) => boolean;
}

const Profile: React.FC<ProfileProps> = ({
  onCancelPurchase,
  localStorageGetItem,
  windowConfirm,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os dados usando a função injetada, não o localStorage global
    const storedUser = localStorageGetItem('currentUser');
    if (storedUser) {
      const currentUser: User = JSON.parse(storedUser);
      setUser(currentUser);
      
      const storedTickets = localStorageGetItem(`tickets_${currentUser.email}`);
      setTickets(storedTickets ? JSON.parse(storedTickets) : []);
    }
    setLoading(false);
  }, [localStorageGetItem]);

  const handleCancelClick = (ticket: Ticket) => {
    if (user && windowConfirm('Tem certeza que deseja cancelar esta compra?')) {
      onCancelPurchase(ticket, user.email);
    }
  };
  
  // Durante o carregamento inicial, não renderiza nada
  if (loading) {
    return null;
  }
  
  // Se não houver usuário após o carregamento, não renderiza o perfil
  if (!user) {
    return null;
  }

  return (
    <div className="profile-container" data-testid="profile-container">
      <h2>Informações do Perfil</h2>
      <p data-testid="profile-email">Email: {user.email}</p>
      <hr />
      <h3>Meus Ingressos</h3>
      {tickets.length > 0 ? (
        <ul className="ticket-list">
          {tickets.map((ticket) => (
            <li key={`${ticket.movieId}-${ticket.purchaseDate}`} className="ticket-item">
              <h4 data-testid={`ticket-title-${ticket.movieId}`}>{ticket.movieTitle}</h4>
              <p data-testid={`ticket-seats-${ticket.movieId}`}>Assentos: {ticket.seats.join(', ')}</p>
              <p data-testid={`ticket-purchase-date-${ticket.movieId}`}>Data da Compra: {ticket.purchaseDate}</p>
              <button
                onClick={() => handleCancelClick(ticket)}
                data-testid={`cancel-button-${ticket.movieId}`}
              >
                Cancelar Compra
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p data-testid="no-tickets-message">Você ainda não comprou nenhum ingresso.</p>
      )}
    </div>
  );
};

export default Profile;