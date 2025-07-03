import React from 'react';
// CORREÇÃO: Importar tudo que o teste precisa
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SeatSelection from './SeatSelection';
import { movies } from '../data/movies';

// Mock do localStorage para controlar o ambiente de teste
const localStorageMock = (() => {
  let store: { [key:string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock do useNavigate para testar o redirecionamento
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Componente SeatSelection', () => {
  // CORREÇÃO: Definição das constantes de setup
  const testMovie = movies[0];
  const user = { email: 'user@example.com' };

  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // CORREÇÃO: Definição da função helper para renderizar
  const renderComponent = (isLoggedIn = false) => {
    if (isLoggedIn) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    return render(
      <MemoryRouter initialEntries={[`/movie/${testMovie.id}/seats`]}>
        <Routes>
          <Route 
            path="/movie/:id/seats" 
            element={<SeatSelection isLoggedIn={isLoggedIn} />} 
          />
        </Routes>
      </MemoryRouter>
    );
  };


  test('deve impedir a compra se o usuário já possui o número máximo de ingressos', () => {
    const existingTickets = [
      { movieId: testMovie.id, movieTitle: testMovie.title, seats: ['D1'], purchaseDate: '...' },
      { movieId: testMovie.id, movieTitle: testMovie.title, seats: ['D2'], purchaseDate: '...' }
    ];
    localStorage.setItem(`tickets_${user.email}`, JSON.stringify(existingTickets));
    renderComponent(true);
    expect(screen.getByText(/Você já atingiu o limite de 2 ingressos para este filme./i)).toBeInTheDocument();
  });

});