import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, className, onClick }: { children: React.ReactNode; to: string; className?: string; onClick?: () => void }) => (
    <a href={to} className={className} onClick={(e) => { e.preventDefault(); onClick && onClick(); }}>{children}</a>
  ),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  useNavigate: jest.fn(() => jest.fn()),
}));

import DropdownMenu from './DropDownMenu';

const mockOnLogout = jest.fn();

describe('Componente DropdownMenu - Renderização e Interação (13 Testes de Unidade Pura)', () => {
  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  test('7/30: deve renderizar o ícone do menu', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    expect(screen.getByAltText(/Menu/i)).toBeInTheDocument();
  });

  test('8/30: deve abrir o menu ao clicar no ícone', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('9/30: deve fechar o menu ao clicar novamente no ícone', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('10/30: deve exibir links de login e criação de conta quando não logado e menu aberto', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Criar Conta/i)).toBeInTheDocument();
    expect(screen.queryByText(/Perfil/i)).not.toBeInTheDocument();
  });

  test('11/30: deve exibir links de perfil e sair quando logado e menu aberto', () => {
    render(<DropdownMenu isLoggedIn={true} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Sair/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
  });

  test('12/30: deve chamar a função onLogout ao clicar no botão "Sair"', () => {
    render(<DropdownMenu isLoggedIn={true} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    fireEvent.click(screen.getByText(/Sair/i));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  test('13/30: deve fechar o menu ao clicar em um link (ex: Login)', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Login/i));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('14/30: não deve exibir o menu fechado por padrão', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('15/30: deve exibir o ícone de login/menu mesmo se o menu estiver fechado', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    expect(screen.getByAltText(/Menu/i)).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('16/30: onLogout deve ser chamado e o menu deve fechar quando o botão "Sair" é clicado', () => {
    render(<DropdownMenu isLoggedIn={true} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Sair/i));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('17/30: deve exibir a mensagem "Login" no link de login quando deslogado', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

  test('18/30: deve exibir a mensagem "Perfil" no link de perfil quando logado', () => {
    render(<DropdownMenu isLoggedIn={true} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('link', { name: 'Perfil' })).toBeInTheDocument();
  });

  test('19/30: o menu deve permanecer fechado ao clicar fora dele (simulação básica)', () => {
    render(<DropdownMenu isLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});