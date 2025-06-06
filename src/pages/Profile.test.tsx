// Profile.test.tsx - 30 TESTES DE UNIDADE (PARTE 5/6)
// NOVO SET DE TESTES - COMPLETAMENTE REFORMULADO PARA TESTES DE UNIDADE PUROS E GARANTIDOS QUE PASSAM

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mocks para isolar o componente Profile de dependências externas
jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: jest.fn(() => jest.fn()), // Mocka useNavigate para retornar uma função mockada
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>, // Mocka Link
}));

// Mocka localStorage globalmente para que ele possa ser controlado nos testes.
// Em testes de unidade puros, idealmente, o componente não dependeria diretamente de localStorage.
// Mas se o Profile.tsx *usa* localStorage, mockamos seu comportamento.
let mockLocalStorageData: { [key: string]: string } = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key: string) => mockLocalStorageData[key] || null),
    setItem: jest.fn((key: string, value: string) => { mockLocalStorageData[key] = value; }),
    removeItem: jest.fn((key: string) => { delete mockLocalStorageData[key]; }),
    clear: jest.fn(() => { mockLocalStorageData = {}; }),
    length: jest.fn(() => Object.keys(mockLocalStorageData).length),
    key: jest.fn(),
  },
  writable: true,
});

// Mocka window.confirm e window.alert para controle total das interações do navegador.
window.confirm = jest.fn();
window.alert = jest.fn();

import Profile from './Profile'; // Importa o componente Profile REAL

describe('Componente Profile - Testes de Unidade Pura (5 Testes Reformulados e Garântidos)', () => {
  // Dados de mock que serão passados ou retornados por mocks
  const mockUser = { email: 'mockuser@example.com' };
  const mockTickets = [
    { movieId: 1, movieTitle: 'Filme Um Mock', seats: ['A1'], purchaseDate: '2025-01-01' },
    { movieId: 2, movieTitle: 'Filme Dois Mock', seats: ['B2', 'B3'], purchaseDate: '2025-01-02' },
  ];

  beforeEach(() => {
    // Limpa todos os mocks e o localStorage mockado para cada teste
    (window.localStorage.clear as jest.Mock).mockClear();
    (window.localStorage.getItem as jest.Mock).mockClear();
    (window.localStorage.setItem as jest.Mock).mockClear();
    (window.localStorage.removeItem as jest.Mock).mockClear();
    (window.confirm as jest.Mock).mockClear();
    (window.alert as jest.Mock).mockClear();
    (require('react-router-dom').useNavigate as jest.Mock)().mockClear(); // Limpa o mock da função retornada por useNavigate

    // Resetar o estado interno do localStorage mockado
    mockLocalStorageData = {};
  });

  // Teste 23/30: Deve renderizar o título principal do perfil ("Informações do Perfil").
  // Este teste é o mais básico de renderização.
  test('23/30: deve renderizar o título principal do perfil', () => {
    // Para que o Profile renderize algo, currentUser não pode ser null.
    // Simulamos que localStorage.getItem('currentUser') retorna um usuário.
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(mockUser));
    
    render(<Profile onCancelPurchase={jest.fn()} />);
    expect(screen.getByRole('heading', { name: /Informações do Perfil/i, level: 2 })).toBeInTheDocument();
  });


  // Teste 24/30: Deve renderizar a mensagem de "nenhum ingresso" quando o componente não recebe tickets.
  // Este teste verifica a renderização condicional.
  test('24/30: deve renderizar a mensagem de "nenhum ingresso" quando não há tickets', () => {
    // Simula que o usuário está logado, mas não tem tickets.
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(mockUser)); // Para currentUser
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(null); // Para tickets_email

    render(<Profile onCancelPurchase={jest.fn()} />);

    // CORREÇÃO: Usar data-testid para encontrar a mensagem de "nenhum ingresso" de forma infalível.
    expect(screen.getByTestId('no-tickets-message')).toHaveTextContent('Você ainda não comprou nenhum ingresso.');
  });


  // Teste 25/30: Deve renderizar os detalhes dos tickets quando o componente recebe tickets.
  test('25/30: deve renderizar os detalhes dos tickets quando houver tickets', () => {
    // Simula que o usuário está logado e tem tickets.
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(mockUser));
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(mockTickets)); // Retorna tickets mockados

    render(<Profile onCancelPurchase={jest.fn()} />);

    // CORREÇÃO: Usar data-testid para encontrar os detalhes dos tickets de forma infalível.
    // Verifica o primeiro ticket
    expect(screen.getByTestId(`ticket-title-${mockTickets[0].movieId}`)).toHaveTextContent(mockTickets[0].movieTitle);
    expect(screen.getByTestId(`ticket-seats-${mockTickets[0].movieId}`)).toHaveTextContent(mockTickets[0].seats.join(', '));
    // Verifica o segundo ticket
    expect(screen.getByTestId(`ticket-title-${mockTickets[1].movieId}`)).toHaveTextContent(mockTickets[1].movieTitle);
    expect(screen.getByTestId(`ticket-seats-${mockTickets[1].movieId}`)).toHaveTextContent(mockTickets[1].seats.join(', '));
    // Verifica a quantidade de botões de cancelar
    expect(screen.getAllByRole('button', { name: 'Cancelar Compra' })).toHaveLength(mockTickets.length);
  });


  // Teste 26/30: Deve chamar a prop onCancelPurchase e window.confirm com o ticket correto quando confirmado.
  test('26/30: deve chamar onCancelPurchase e window.confirm com o ticket correto quando confirmado', () => {
    const mockOnCancelPurchase = jest.fn(); // Mock da prop
    // Simula que o usuário está logado e tem tickets.
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(mockUser));
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(mockTickets));
    (window.confirm as jest.Mock).mockReturnValue(true); // Simula que o usuário confirmou

    render(<Profile onCancelPurchase={mockOnCancelPurchase} />);

    // Clica no botão de cancelar do primeiro ticket
    fireEvent.click(screen.getByTestId(`cancel-button-${mockTickets[0].movieId}`));

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja cancelar esta compra?');
    expect(mockOnCancelPurchase).toHaveBeenCalledTimes(1);
    expect(mockOnCancelPurchase).toHaveBeenCalledWith(mockTickets[0], mockUser.email);
  });


  // Teste 27/30: Não deve chamar onCancelPurchase se o cancelamento não for confirmado.
  test('27/30: não deve chamar onCancelPurchase se o cancelamento não for confirmado', () => {
    const mockOnCancelPurchase = jest.fn(); // Mock da prop
    // Simula que o usuário está logado e tem tickets.
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(mockUser));
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(mockTickets));
    (window.confirm as jest.Mock).mockReturnValue(false); // Simula que o usuário NÃO confirmou

    render(<Profile onCancelPurchase={mockOnCancelPurchase} />);

    // Clica no botão de cancelar de um ticket
    fireEvent.click(screen.getByTestId(`cancel-button-${mockTickets[0].movieId}`));

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja cancelar esta compra?');
    expect(mockOnCancelPurchase).not.toHaveBeenCalled(); // Verifica que a prop NÃO foi chamada
  });
});