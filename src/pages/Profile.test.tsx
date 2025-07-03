// Em seu arquivo: src/pages/Profile.test.tsx

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

// Seu mock de react-router-dom estava correto
jest.mock('react-router-dom', () => ({
  __esModule: true,
  useNavigate: jest.fn(() => jest.fn()),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

// A injeção de dependência é a chave aqui
interface ProfileExternalApiProps {
  localStorageGetItem: (key: string) => string | null;
  windowConfirm: (message?: string) => boolean;
}

let Profile: React.ComponentType<any>;

describe('Componente Profile - Testes de Unidade Pura', () => {
  const mockUser = { email: 'mockuser@example.com' };
  const mockTickets = [
    { movieId: 1, movieTitle: 'Filme Um Mock', seats: ['A1'], purchaseDate: '2025-01-01' },
    { movieId: 2, movieTitle: 'Filme Dois Mock', seats: ['B2', 'B3'], purchaseDate: '2025-01-02' },
  ];
  const mockOnCancelPurchase = jest.fn();

  beforeAll(() => {
    // Usar require aqui é uma boa técnica em testes para componentes com dependências
    Profile = require('./Profile').default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderProfile = (
    userToMock: { email: string } | null,
    ticketsToMock: typeof mockTickets | null,
    injectedProps?: Partial<ProfileExternalApiProps>
  ) => {
    const defaultProps: ProfileExternalApiProps = {
      localStorageGetItem: jest.fn().mockImplementation((key: string) => {
        if (key === 'currentUser') return userToMock ? JSON.stringify(userToMock) : null;
        if (key.startsWith('tickets_') && userToMock) return ticketsToMock ? JSON.stringify(ticketsToMock) : null;
        return null;
      }),
      windowConfirm: jest.fn(),
      ...injectedProps,
    };

    return render(
      <Profile
        onCancelPurchase={mockOnCancelPurchase}
        {...defaultProps}
      />
    );
  };

  test('1: deve renderizar o título principal do perfil e o email do usuário', async () => {
    renderProfile(mockUser, mockTickets);
    // findByRole espera o elemento aparecer na tela
    expect(await screen.findByRole('heading', { name: /Informações do Perfil/i })).toBeInTheDocument();
    expect(await screen.findByTestId('profile-email')).toHaveTextContent(mockUser.email);
  });

  test('2: deve renderizar a mensagem de "nenhum ingresso" quando não há tickets', async () => {
    renderProfile(mockUser, null);
    expect(await screen.findByTestId('no-tickets-message')).toBeInTheDocument();
  });

  test('3: deve renderizar os detalhes dos tickets quando houver tickets', async () => {
    renderProfile(mockUser, mockTickets);
    expect(await screen.findByText(mockTickets[0].movieTitle)).toBeInTheDocument();
    expect(screen.getByText(`Assentos: ${mockTickets[0].seats.join(', ')}`)).toBeInTheDocument();
  });

  test('4: deve chamar onCancelPurchase quando o cancelamento for confirmado', async () => {
    const mockConfirm = jest.fn(() => true);
    renderProfile(mockUser, mockTickets, { windowConfirm: mockConfirm });
    
    const cancelButton = await screen.findByTestId(`cancel-button-${mockTickets[0].movieId}`);
    fireEvent.click(cancelButton);

    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancelPurchase).toHaveBeenCalledTimes(1);
    expect(mockOnCancelPurchase).toHaveBeenCalledWith(mockTickets[0], mockUser.email);
  });

  test('5: não deve chamar onCancelPurchase se o cancelamento não for confirmado', async () => {
    const mockConfirm = jest.fn(() => false);
    renderProfile(mockUser, mockTickets, { windowConfirm: mockConfirm });

    const cancelButton = await screen.findByTestId(`cancel-button-${mockTickets[0].movieId}`);
    fireEvent.click(cancelButton);
    
    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancelPurchase).not.toHaveBeenCalled();
  });
});