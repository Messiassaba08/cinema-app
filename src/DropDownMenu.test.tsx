// DropDownMenu.test.tsx - 30 TESTES DE UNIDADE (PARTE 2/6) + 3 NOVOS
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// CORREÇÃO: Remover BrowserRouter daqui, pois o Link já está mockado para teste de unidade.
// import { BrowserRouter as Router } from 'react-router-dom';

// CORREÇÃO: Mockar react-router-dom para DropdownMenu.
// Os Links não precisarão de um Router externo se a navegação for mockada.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Mantém o que é real (ex: tipos)
  Link: ({ children, to, className, onClick }: { children: React.ReactNode; to: string; className?: string; onClick?: () => void }) => (
    // Mocka Link para ser um <a> simples e chamar onClick (se houver)
    <a href={to} className={className} onClick={(e) => { e.preventDefault(); onClick && onClick(); }}>{children}</a>
  ),
  // Mocks para outros componentes do router que não são usados diretamente no DropdownMenu,
  // mas podem ser importados por outras partes da aplicação ou pelo App.
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  useNavigate: jest.fn(() => jest.fn()), // Mocka useNavigate, caso seja indiretamente usado
}));

import DropdownMenu from './DropDownMenu';

const mockOnLogout = jest.fn();

describe('Componente DropdownMenu - Renderização e Interação (8 Testes de Unidade Pura)', () => {
  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  // Teste 7/30: Deve renderizar o ícone do menu.
  test('7/30: deve renderizar o ícone do menu', () => {
    // CORREÇÃO: Remover o Router externo, pois o Link está mockado.
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    expect(screen.getByAltText(/Menu/i)).toBeInTheDocument();
  });

  // Teste 8/30: Deve abrir o menu ao clicar no ícone.
  test('8/30: deve abrir o menu ao clicar no ícone', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i)); // Abre o menu
    // Este teste passará SE o <ul> no seu DropdownMenu.tsx (componente real) tiver role="menu"
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  // Teste 9/30: Deve fechar o menu ao clicar novamente no ícone.
  test('9/30: deve fechar o menu ao clicar novamente no ícone', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i)); // Abre
    fireEvent.click(screen.getByAltText(/Menu/i)); // Fecha
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  // Teste 10/30: Deve exibir links de login e criação de conta quando não logado e menu aberto.
  test('10/30: deve exibir links de login e criação de conta quando não logado e menu aberto', () => {
    // CORREÇÃO: Remover o Router externo.
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i)); // Abre o menu
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Criar Conta/i)).toBeInTheDocument();
    expect(screen.queryByText(/Perfil/i)).not.toBeInTheDocument(); // Garante que não aparece "Perfil"
  });

  // Teste 11/30: Deve exibir links de perfil e sair quando logado e menu aberto.
  test('11/30: deve exibir links de perfil e sair quando logado e menu aberto', () => {
    // CORREÇÃO: Remover o Router externo.
    render(<DropdownMenu isLoggedIn={true} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i)); // Abre o menu
    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Sair/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument(); // Garante que não aparece "Login"
  });

  // NOVO TESTE 12/30: Deve chamar a função onLogout ao clicar no botão "Sair".
  test('12/30: deve chamar a função onLogout ao clicar no botão "Sair"', () => {
    // CORREÇÃO: Remover o Router externo.
    render(<DropdownMenu isLoggedIn={true} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i)); // Abre o menu
    fireEvent.click(screen.getByText(/Sair/i)); // Clica no botão "Sair"
    expect(mockOnLogout).toHaveBeenCalledTimes(1); // Verifica se a função de logout foi chamada
  });

  // NOVO TESTE 13/30: Deve fechar o menu ao clicar em um link (ex: Login).
  test('13/30: deve fechar o menu ao clicar em um link (ex: Login)', () => {
    // CORREÇÃO: Remover o Router externo.
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i)); // Abre o menu
    expect(screen.getByRole('menu')).toBeInTheDocument(); // Verifica se está aberto
    fireEvent.click(screen.getByText(/Login/i)); // Clica no link "Login"
    expect(screen.queryByRole('menu')).not.toBeInTheDocument(); // Verifica se o menu fechou
  });

  // NOVO TESTE 14/30: Não deve exibir o menu fechado por padrão.
  test('14/30: não deve exibir o menu fechado por padrão', () => {
    // CORREÇÃO: Remover o Router externo.
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument(); // Verifica se o menu não está visível
  });
});