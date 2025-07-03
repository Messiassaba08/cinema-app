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
    render(<DropdownMenu isLoggedIn={false} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    expect(screen.getByAltText(/Menu/i)).toBeInTheDocument();
  });

  test('8/30: deve abrir o menu ao clicar no ícone', () => {
    render(<DropdownMenu isLoggedIn={false} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('9/30: deve fechar o menu ao clicar novamente no ícone', () => {
    render(<DropdownMenu isLoggedIn={false} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('10/30: deve exibir links de login e criação de conta quando não logado e menu aberto', () => {
    render(<DropdownMenu isLoggedIn={false} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Criar Conta/i)).toBeInTheDocument();
    expect(screen.queryByText(/Perfil/i)).not.toBeInTheDocument();
  });

  test('11/30: deve exibir links de perfil e sair quando logado e menu aberto', () => {
    render(<DropdownMenu isLoggedIn={true} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Sair/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
  });

  test('12/30: deve chamar a função onLogout ao clicar no botão "Sair"', () => {
    render(<DropdownMenu isLoggedIn={true} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    fireEvent.click(screen.getByText(/Sair/i));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  test('13/30: deve fechar o menu ao clicar em um link (ex: Login)', () => {
    render(<DropdownMenu isLoggedIn={false} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Login/i));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('14/30: não deve exibir o menu fechado por padrão', () => {
    render(<DropdownMenu isLoggedIn={false} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('15/30: deve exibir o ícone de login/menu mesmo se o menu estiver fechado', () => {
    render(<DropdownMenu isLoggedIn={false} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    expect(screen.getByAltText(/Menu/i)).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('16/30: onLogout deve ser chamado e o menu deve fechar quando o botão "Sair" é clicado', () => {
    render(<DropdownMenu isLoggedIn={true} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Sair/i));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  test('17/30: deve exibir a mensagem "Login" no link de login quando deslogado', () => {
    render(<DropdownMenu isLoggedIn={false} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

  test('18/30: deve exibir a mensagem "Perfil" no link de perfil quando logado', () => {
    render(<DropdownMenu isLoggedIn={true} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('link', { name: 'Perfil' })).toBeInTheDocument();
  });

  // TESTE 19/30 (CORRIGIDO): Testa a funcionalidade de "clicar fora"
  test('19/30: deve fechar o menu ao clicar fora de sua área', () => {
    render(<DropdownMenu isLoggedIn={true} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    
    // 1. Abre o menu
    fireEvent.click(screen.getByAltText(/Menu/i));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // 2. Simula um clique no corpo do documento (fora do menu)
    fireEvent.mouseDown(document.body);

    // 3. Verifica se o menu foi fechado
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  // TESTE 20/30: Verifica a renderização do link de Admin
  test('20/30: deve exibir o link "Painel do Admin" para usuários administradores', () => {
    render(<DropdownMenu isLoggedIn={true} isAdminLoggedIn={true} onLogout={mockOnLogout} />);
    
    // Abre o menu
    fireEvent.click(screen.getByAltText(/Menu/i));

    // Verifica se os links de usuário logado e de admin estão presentes
    expect(screen.getByText(/Painel do Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Perfil/i)).toBeInTheDocument();
  });

  // TESTE 21/30: Verifica o caso negativo para o link de Admin
  test('21/30: não deve exibir o link "Painel do Admin" para usuários comuns', () => {
    render(<DropdownMenu isLoggedIn={true} isAdminLoggedIn={false} onLogout={mockOnLogout} />);

    fireEvent.click(screen.getByAltText(/Menu/i));

    // A consulta 'queryByText' é usada para garantir que o elemento NÃO existe
    expect(screen.queryByText(/Painel do Admin/i)).not.toBeInTheDocument();
  });

  // TESTE 22/30: Verifica a atualização dos atributos de acessibilidade (ARIA)
  test('22/30: deve atualizar o atributo aria-expanded corretamente', () => {
    render(<DropdownMenu isLoggedIn={false} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    
    // O botão que abre o menu deve ter 'aria-expanded'
    const toggleButton = screen.getByRole('button', { name: /Menu/i });

    // Estado inicial: fechado
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    // Abre o menu
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    // Fecha o menu
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  // TESTE 23/30: Garante que um clique dentro do menu não o fecha
  test('23/30: não deve fechar o menu ao clicar dentro de sua área', () => {
    render(<DropdownMenu isLoggedIn={true} isAdminLoggedIn={false} onLogout={mockOnLogout} />);
    
    fireEvent.click(screen.getByAltText(/Menu/i));
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    // Simula um clique dentro do próprio menu
    fireEvent.mouseDown(menu);

    // O menu deve permanecer aberto
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
