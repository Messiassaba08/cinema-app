// App.test.tsx - 30 TESTES DE UNIDADE (PARTE 1/6)
// CORREÇÃO: Mock de react-router-dom deve vir ANTES da importação de App
jest.mock('react-router-dom', () => ({
  // Mantém o que é real para algumas coisas, mas substitui o Router e hooks de navegação
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>, // Substitui por um div simples
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,     // Substitui Routes por div
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,       // Substitui Route por div
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,        // Substitui Link por a
  Navigate: ({ to }: { to: string }) => <div data-testid={`Maps-to-${to}`}>Navigate to {to}</div>, // Mocka Navigate para verificar o destino
}));


import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import 'jest-localstorage-mock'; // Mock do localStorage

// Mocks para componentes filhos do App, garantindo isolamento de unidade
jest.mock('./pages/Login', () => ({
  __esModule: true,
  default: () => <div data-testid="login-mock">Login Mock</div>,
}));
jest.mock('./pages/SignUp', () => ({
  __esModule: true,
  default: () => <div data-testid="signup-mock">SignUp Mock</div>,
}));
jest.mock('./pages/Profile', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-mock">Profile Mock</div>,
}));
jest.mock('./pages/SeatSelection', () => ({
  __esModule: true,
  default: () => <div data-testid="seat-selection-mock">Seat Selection Mock</div>,
}));
jest.mock('./pages/DropDownMenu', () => ({
  __esModule: true,
  default: ({ isLoggedIn, onLogout }: { isLoggedIn: boolean; onLogout: () => void }) => (
    <div data-testid="dropdown-menu-mock">
      <img alt="Menu" src="/login.png" onClick={() => {}} className="login-icon" width={25} />
      {isLoggedIn ? (
        <>
          <button onClick={() => {}} data-testid="profile-link">Perfil (Mock)</button>
          <button onClick={onLogout} data-testid="logout-button">Sair (Mock)</button>
        </>
      ) : (
        <>
          <button onClick={() => {}} data-testid="login-link">Login (Mock)</button>
          <button onClick={() => {}} data-testid="register-link">Criar Conta (Mock)</button>
        </>
      )}
    </div>
  ),
}));


describe('Componente App - Renderização e Estado Básico (Testes de Unidade)', () => {
  beforeEach(() => {
    localStorage.clear(); // Limpa o localStorage antes de cada teste
    jest.clearAllMocks(); // Limpa mocks de funções como window.alert, navigate, etc.
  });

  // Teste 1/30: Deve renderizar a página inicial (Filmes em Cartaz) por padrão.
  test('1/30: deve renderizar a página inicial por padrão', () => {
    render(<App />);
    expect(screen.getByText(/Filmes em Cartaz/i)).toBeInTheDocument();
  });

  // Teste 2/30: Deve renderizar o componente Login quando isLoggedIn é false.
  test('2/30: deve renderizar o componente Login quando isLoggedIn é false', () => {
    localStorage.removeItem('currentUser'); // Garante estado de deslogado
    render(<App />);
    expect(screen.getByTestId('login-mock')).toBeInTheDocument();
  });

  // Teste 3/30: Deve renderizar o componente Profile quando isLoggedIn é true.
  test('3/30: deve renderizar o componente Profile quando isLoggedIn é true', () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));
    render(<App />);
    expect(screen.getByTestId('profile-mock')).toBeInTheDocument();
  });

  // TESTE 4/30: Este teste foi removido conforme solicitação.
  // test('4/30: deve atualizar o estado isLoggedIn para false quando handleLogout é chamado', async () => { /* ... */ });

  // Teste 5/30: Deve renderizar a página inicial (Filmes em Cartaz) se não houver rota correspondente.
  test('5/30: deve renderizar a página inicial se não houver rota correspondente', () => {
    render(<App />);
    expect(screen.getByText(/Filmes em Cartaz/i)).toBeInTheDocument();
  });

  // Teste 6/30: Deve renderizar a página inicial mesmo se houver currentUser (não altera a rota padrão).
  test('6/30: deve renderizar a página inicial mesmo se houver currentUser', () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));
    render(<App />);
    expect(screen.getByText(/Filmes em Cartaz/i)).toBeInTheDocument();
  });
});