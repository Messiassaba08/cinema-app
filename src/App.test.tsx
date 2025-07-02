import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import 'jest-localstorage-mock';

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


describe('Componente App - Estado e Componentes Condicionais (Testes de Unidade Pura)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('1/30: deve renderizar o DropdownMenu mockado', () => {
    render(<App />);
    expect(screen.getByTestId('dropdown-menu-mock')).toBeInTheDocument();
  });

  test('2/30: deve renderizar o App no estado deslogado por padrão', () => {
    localStorage.removeItem('currentUser');
    render(<App />);
    expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Deslogado');
  });

  test('3/30: deve renderizar o App no estado logado se houver currentUser no localStorage', () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));
    render(<App />);
    expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Logado');
  });

  test('4/30: handleLogin deve definir isLoggedIn como true e salvar currentUser no localStorage', async () => {
    const { rerender } = render(<App />);

    const loginMockComponent = screen.getByTestId('login-mock');

    localStorage.setItem('currentUser', JSON.stringify({ email: 'new@user.com' }));

    fireEvent.click(loginMockComponent);

    rerender(<App />);

    expect(localStorage.getItem('currentUser')).not.toBeNull();
    expect(screen.getByTestId('mock-login-status')).toHaveTextContent('Logado');
  });

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
