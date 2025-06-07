// SeatSelection.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, className, onClick }: { children: React.ReactNode; to: string; className?: string; onClick?: () => void }) => (
    <a href={to} className={className} onClick={(e) => { e.preventDefault(); onClick && onClick(); }}>{children}</a>
  ),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

import SeatSelection from './SeatSelection';

jest.mock('../data/movies', () => ({
  movies: [{ id: 1, title: 'Filme de Teste', posterUrl: 'teste.jpg' }],
}));

import 'jest-localstorage-mock';
window.alert = jest.fn();

describe('Componente SeatSelection - Renderização e Interação (3 Testes de Unidade Pura)', () => {
  beforeEach(() => {
    localStorage.clear();
    (window.alert as jest.Mock).mockClear();
  });

  test('28/30: deve exibir o título do filme', () => {
    render(<SeatSelection isLoggedIn={false} />);
    expect(screen.getByText(/Selecionar Assentos - Filme de Teste/i)).toBeInTheDocument();
  });

  test('29/30: deve permitir selecionar um assento disponível', () => {
    render(<SeatSelection isLoggedIn={false} />);
    fireEvent.click(screen.getByText('A1'));
    expect(screen.getByText('A1')).toHaveClass('selected');
  });

  test('30/30: deve alertar se tentar confirmar a compra sem estar logado', () => {
    render(<SeatSelection isLoggedIn={false} />);
    fireEvent.click(screen.getByText('A1'));
    fireEvent.click(screen.getByRole('button', { name: /Confirmar Assentos/i }));
    expect(window.alert).toHaveBeenCalledWith("Você precisa estar logado para confirmar a compra.");
  });
});