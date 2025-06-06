// SignUp.test.tsx - 30 TESTES DE UNIDADE (PARTE 4/6)
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// CORREÇÃO: Mockar react-router-dom para SignUp, já que Link e navigate são usados.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, className, onClick }: { children: React.ReactNode; to: string; className?: string; onClick?: () => void }) => (
    <a href={to} className={className} onClick={(e) => { e.preventDefault(); onClick && onClick(); }}>{children}</a>
  ),
  useNavigate: () => jest.fn(), // Mocka useNavigate para não ter efeito real
}));

import SignUp from './SignUp';
import 'jest-localstorage-mock'; // Mock do localStorage

window.alert = jest.fn(); // Mock do alert

describe('Componente SignUp - Renderização e Interação (5 Testes de Unidade Pura)', () => {
  beforeEach(() => {
    localStorage.clear(); // Limpa o localStorage
    (window.alert as jest.Mock).mockClear();
  });

  // Teste 18/30: Deve renderizar os campos de email e senha e o botão de cadastro.
  test('18/30: deve renderizar os campos de email e senha e o botão de cadastro', () => {
    render(<SignUp />);
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  // Teste 19/30: Deve exibir mensagem de erro se o email já estiver cadastrado.
  test('19/30: deve exibir mensagem de erro se o email já estiver cadastrado', async () => {
    localStorage.setItem('users', JSON.stringify([{ email: 'existente@teste.com', password: 'senhaExistente' }]));
    render(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'existente@teste.com' } });
    fireEvent.change(screen.getByLabelText(/Senha:/i), { target: { value: 'novaSenhaLonga' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Este email já está cadastrado./i)).toBeInTheDocument();
    });
  });

  // Teste 20/30: Deve criar uma nova conta com sucesso e alertar sucesso.
  test('20/30: deve criar uma nova conta com sucesso e alertar sucesso', async () => {
    render(<SignUp />);
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'novo@usuario.com' } });
    fireEvent.change(screen.getByLabelText(/Senha:/i), { target: { value: 'novaSenha123' } });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Conta criada com sucesso! Você já pode fazer login.");
    });
  });

  // NOVO TESTE 21/30 (SUBSTITUTO): Deve renderizar o título "Criar Conta".
  // Este é um teste de unidade puro e simples, verificando um elemento estático.
  test('21/30: deve renderizar o título "Criar Conta"', () => {
    render(<SignUp />);
    expect(screen.getByRole('heading', { name: /Criar Conta/i, level: 2 })).toBeInTheDocument();
  });

  // Teste 22/30: Deve ter um link para "Entrar".
  test('22/30: deve ter um link para "Entrar"', () => {
    render(<SignUp />);
    expect(screen.getByRole('link', { name: /Entrar/i })).toBeInTheDocument();
  });
});