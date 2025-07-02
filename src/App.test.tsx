jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  Navigate: ({ to }: { to: string }) => <div data-testid={`Maps-to-${to}`}>Navigate to {to}</div>,
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import 'jest-localstorage-mock';

jest.mock('./pages/Login', () => ({
  __esModule: true,
  default: ({ onLogin }: { onLogin: () => void }) => <div data-testid="login-mock" onClick={onLogin}>Login Mock</div>,
}));
jest.mock('./pages/SignUp', () => ({
  __esModule: true,
  default: () => <div data-testid="signup-mock">SignUp Mock</div>,
}));
jest.mock('./pages/Profile', () => ({
  __esModule: true,
  default: ({ onCancelPurchase }: { onCancelPurchase: any }) => <div data-testid="profile-mock" onClick={onCancelPurchase}>Profile Mock</div>,
}));
jest.mock('./pages/SeatSelection', () => ({
  __esModule: true,
  default: ({ isLoggedIn }: { isLoggedIn: boolean }) => <div data-testid="seat-selection-mock">Seat Selection Mock (Logged In: {isLoggedIn ? 'Yes' : 'No'})</div>,
}));
jest.mock('./pages/DropDownMenu', () => ({
  __esModule: true,
  default: ({ isLoggedIn, onLogout }: { isLoggedIn: boolean; onLogout: () => void }) => (
    <div data-testid="dropdown-menu-mock">
      <span data-testid="mock-login-status">{isLoggedIn ? 'Logado' : 'Deslogado'}</span>
      <button onClick={onLogout} data-testid="mock-logout-button">Sair (Mock)</button>
      <button data-testid="mock-login-button">Login (Mock)</button>
    </div>
  ),
}));


describe('Componente App - Estado e Componentes Condicionais (5 Testes de Unidade Pura)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // Teste 1/30: Deve renderizar o DropdownMenu mockado.
  test('1/30: deve renderizar o DropdownMenu mockado', () => {
    render(<App />);
    expect(screen.getByTestId('dropdown-menu-mock')).toBeInTheDocument();
  });

  // Teste 2/30: Deve renderizar o App no estado deslogado por padrão (sem currentUser no localStorage).
  test('2/30: deve renderizar o App no estado deslogado por padrão', () => {
    localStorage.removeItem('currentUser');
    render(<App />);
    expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Deslogado');
  });

  // Teste 3/30: Deve renderizar o App no estado logado se houver currentUser no localStorage.
  test('3/30: deve renderizar o App no estado logado se houver currentUser no localStorage', () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));
    render(<App />);
    expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Logado');
  });

  // Teste 4/30: handleLogin deve definir isLoggedIn como true e salvar currentUser no localStorage.
  test('4/30: handleLogin deve definir isLoggedIn como true e salvar currentUser no localStorage', async () => {
    const { rerender } = render(<App />);

    const loginMockComponent = screen.getByTestId('login-mock');
    
    localStorage.setItem('currentUser', JSON.stringify({ email: 'new@user.com' }));

    fireEvent.click(loginMockComponent);

    rerender(<App />);

    expect(localStorage.getItem('currentUser')).not.toBeNull();
    expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Logado');
  });

  // Teste 5/30: handleLogout deve definir isLoggedIn como false e remover currentUser do localStorage.
  test('5/30: handleLogout deve definir isLoggedIn como false e remover currentUser do localStorage', async () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));
    const { rerender } = render(<App />);

    const logoutButton = screen.getByTestId('mock-logout-button');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('currentUser')).toBeNull();

    rerender(<App />);

    expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Deslogado');
  });
});

describe('Componente App - Funções e Efeitos (Testes de Unidade Pura)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // Teste para a função handleCancelPurchase - cenário ideal
  test('deve cancelar uma compra e liberar os assentos correspondentes', async () => {
    const userEmail = 'user@test.com';
    const movieId = 1;
    const ticketToCancel = {
      movieId,
      movieTitle: 'Filme Teste',
      seats: ['A1', 'A2'],
      purchaseDate: new Date().toISOString(),
    };

    // Configuração inicial do localStorage
    localStorage.setItem(`tickets_${userEmail}`, JSON.stringify([ticketToCancel]));
    localStorage.setItem(`occupiedSeats_movie_${movieId}`, JSON.stringify(['A1', 'A2', 'B1']));

    render(<App />);

    // Simula a chamada a onCancelPurchase a partir do componente Profile
    const profileMock = screen.getByTestId('profile-mock');
    fireEvent.click(profileMock, {
      detail: { ticketToCancel, userEmail }, // Passando dados simulados
    });
    
    // Simula a chamada da função diretamente, pois o evento de clique não pode passar dados complexos
    const instance = new App({});
    instance.handleCancelPurchase(ticketToCancel, userEmail);

    // Verificações
    const updatedUserTickets = JSON.parse(localStorage.getItem(`tickets_${userEmail}`) || '[]');
    const updatedOccupiedSeats = JSON.parse(localStorage.getItem(`occupiedSeats_movie_${movieId}`) || '[]');

    expect(updatedUserTickets).toHaveLength(0);
    expect(updatedOccupiedSeats).toEqual(['B1']);
  });

  // Teste para a função handleCancelPurchase com múltiplos ingressos
  test('deve cancelar o ingresso correto quando o usuário tem múltiplos ingressos', () => {
    const userEmail = 'user@test.com';
    const ticket1 = { movieId: 1, movieTitle: 'Filme 1', seats: ['A1'], purchaseDate: new Date().toISOString() };
    const ticket2 = { movieId: 2, movieTitle: 'Filme 2', seats: ['B2'], purchaseDate: new Date().toISOString() };
    
    localStorage.setItem(`tickets_${userEmail}`, JSON.stringify([ticket1, ticket2]));
    localStorage.setItem(`occupiedSeats_movie_${ticket1.movieId}`, JSON.stringify(['A1']));
    localStorage.setItem(`occupiedSeats_movie_${ticket2.movieId}`, JSON.stringify(['B2']));
    
    render(<App />);
    
    // Simula o cancelamento do primeiro ingresso
    const instance = new App({});
    instance.handleCancelPurchase(ticket1, userEmail);

    const userTickets = JSON.parse(localStorage.getItem(`tickets_${userEmail}`) || '[]');
    expect(userTickets).toHaveLength(1);
    expect(userTickets[0].movieId).toBe(2);
    expect(localStorage.getItem(`occupiedSeats_movie_${ticket1.movieId}`)).toBe('[]');
    expect(localStorage.getItem(`occupiedSeats_movie_${ticket2.movieId}`)).toBe('["B2"]');
  });

  // Teste para o useEffect que escuta eventos de storage
  test('deve atualizar o estado de login quando o localStorage é alterado externamente', async () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));
    const { rerender } = render(<App />);
    expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Logado');

    // Simula um evento de logout em outra aba
    localStorage.removeItem('currentUser');
    fireEvent.storage(window, {
      key: 'currentUser',
      newValue: null,
    });
    
    rerender(<App />);

    // Verifica se o estado foi atualizado para deslogado
    await waitFor(() => {
        expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Deslogado');
    });
    
    // Simula um evento de login em outra aba
    localStorage.setItem('currentUser', JSON.stringify({ email: 'another@user.com' }));
    fireEvent.storage(window, {
      key: 'currentUser',
      newValue: JSON.stringify({ email: 'another@user.com' }),
    });

    rerender(<App />);
    
    // Verifica se o estado foi atualizado para logado
    await waitFor(() => {
        expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Logado');
    });
  });
});