// SeatSelection.test.tsx - 30 TESTES DE UNIDADE (PARTE 6/6)
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// CORREÇÃO: Mockar react-router-dom para SeatSelection, já que Link e navigate são usados.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, className, onClick }: { children: React.ReactNode; to: string; className?: string; onClick?: () => void }) => (
    <a href={to} className={className} onClick={(e) => { e.preventDefault(); onClick && onClick(); }}>{children}</a>
  ),
  useParams: () => ({ id: '1' }), // Mocka useParams
  useNavigate: () => jest.fn(), // Mocka useNavigate
}));

import SeatSelection from './SeatSelection';

// Mock dos dados dos filmes para garantir consistência e isolamento.
jest.mock('../data/movies', () => ({
  movies: [{ id: 1, title: 'Filme de Teste', posterUrl: 'teste.jpg' }],
}));

// Mock de localStorage e window.alert para garantir isolamento e controle.
import 'jest-localstorage-mock';
window.alert = jest.fn();

describe('Componente SeatSelection - Renderização e Interação (3 Testes de Unidade Pura)', () => {
  beforeEach(() => {
    localStorage.clear(); // Limpa o localStorage
    (window.alert as jest.Mock).mockClear();
  });

  // Teste 28/30: Deve exibir o título do filme.
  test('28/30: deve exibir o título do filme', () => {
    render(<SeatSelection isLoggedIn={false} />);
    expect(screen.getByText(/Selecionar Assentos - Filme de Teste/i)).toBeInTheDocument();
  });

  // Teste 29/30: Deve permitir selecionar um assento disponível.
  test('29/30: deve permitir selecionar um assento disponível', () => {
    render(<SeatSelection isLoggedIn={false} />);
    fireEvent.click(screen.getByText('A1'));
    expect(screen.getByText('A1')).toHaveClass('selected');
  });

  // Teste 30/30: Deve alertar se tentar confirmar a compra sem estar logado.
  test('30/30: deve alertar se tentar confirmar a compra sem estar logado', () => {
    render(<SeatSelection isLoggedIn={false} />);
    fireEvent.click(screen.getByText('A1')); // Seleciona um assento
    fireEvent.click(screen.getByRole('button', { name: /Confirmar Assentos/i }));
    expect(window.alert).toHaveBeenCalledWith("Você precisa estar logado para confirmar a compra.");
  });
});