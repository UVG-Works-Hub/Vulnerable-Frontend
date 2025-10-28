import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import InterfazMedico from './InterfazMedico';

// componentes hijos
jest.mock('../BusquedaMensual', () => {
  return function BusquedaMensual({ lugarid }) {
    return <div data-testid="busqueda-mensual">Busqueda Mensual Component - Lugar ID: {lugarid}</div>;
  };
});

jest.mock('../Expediente', () => {
  return function Expediente() {
    return <div data-testid="expediente">Expediente Component</div>;
  };
});

const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/interfaz-medico',
  state: { lugarid: 1 }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation,
  useNavigate: () => mockNavigate,
}));

describe('InterfazMedico Component', () => {
  beforeEach(() => {
    mockLocation.state = { lugarid: 1 };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders navigation buttons', () => {
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    // Usar getByRole para ser más específico con los botones
    expect(screen.getByRole('button', { name: /Busqueda Mensual/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Expediente/i })).toBeInTheDocument();
  });

  test('renders BusquedaMensual component by default', () => {
    mockLocation.state = { lugarid: 123 };
    
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('busqueda-mensual')).toBeInTheDocument();
    expect(screen.getByText(/Lugar ID: 123/i)).toBeInTheDocument();
    expect(screen.queryByTestId('expediente')).not.toBeInTheDocument();
  });

  test('switches to Expediente when Expediente button is clicked', () => {
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    const expedienteButton = screen.getByRole('button', { name: /Expediente/i });
    fireEvent.click(expedienteButton);
    
    expect(screen.getByTestId('expediente')).toBeInTheDocument();
    expect(screen.queryByTestId('busqueda-mensual')).not.toBeInTheDocument();
  });

  test('switches back to BusquedaMensual when BusquedaMensual button is clicked', () => {
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    // Primero cambiar a Expediente
    const expedienteButton = screen.getByRole('button', { name: /Expediente/i });
    fireEvent.click(expedienteButton);
    
    expect(screen.getByTestId('expediente')).toBeInTheDocument();
    
    // Luego volver a BusquedaMensual
    const busquedaMensualButton = screen.getByRole('button', { name: /Busqueda Mensual/i });
    fireEvent.click(busquedaMensualButton);
    
    expect(screen.getByTestId('busqueda-mensual')).toBeInTheDocument();
    expect(screen.queryByTestId('expediente')).not.toBeInTheDocument();
  });

  test('passes lugarid prop to BusquedaMensual component', () => {
    mockLocation.state = { lugarid: 456 };
    
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Lugar ID: 456/i)).toBeInTheDocument();
  });

  test('handles state changes correctly', () => {
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    // Estado inicial: BusquedaMensual visible
    expect(screen.getByTestId('busqueda-mensual')).toBeInTheDocument();
    
    // Click en Expediente
    fireEvent.click(screen.getByRole('button', { name: /Expediente/i }));
    expect(screen.getByTestId('expediente')).toBeInTheDocument();
    expect(screen.queryByTestId('busqueda-mensual')).not.toBeInTheDocument();
    
    // Click en BusquedaMensual nuevamente
    fireEvent.click(screen.getByRole('button', { name: /Busqueda Mensual/i }));
    expect(screen.getByTestId('busqueda-mensual')).toBeInTheDocument();
    expect(screen.queryByTestId('expediente')).not.toBeInTheDocument();
  });

  test('renders with lugarid from location state', () => {
    mockLocation.state = { lugarid: 789 };
    
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Lugar ID: 789/i)).toBeInTheDocument();
  });

  test('navigation buttons are always visible', () => {
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    // Verificar que los botones están presentes inicialmente
    expect(screen.getByRole('button', { name: /Busqueda Mensual/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Expediente/i })).toBeInTheDocument();
    
    // Cambiar a Expediente
    fireEvent.click(screen.getByRole('button', { name: /Expediente/i }));
    
    // Verificar que los botones siguen presentes
    expect(screen.getByRole('button', { name: /Busqueda Mensual/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Expediente/i })).toBeInTheDocument();
  });

  test('only one component is visible at a time', () => {
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    // Solo BusquedaMensual debe estar visible inicialmente
    expect(screen.getByTestId('busqueda-mensual')).toBeInTheDocument();
    expect(screen.queryByTestId('expediente')).not.toBeInTheDocument();
    
    // Cambiar a Expediente
    fireEvent.click(screen.getByRole('button', { name: /Expediente/i }));
    
    // Solo Expediente debe estar visible
    expect(screen.queryByTestId('busqueda-mensual')).not.toBeInTheDocument();
    expect(screen.getByTestId('expediente')).toBeInTheDocument();
  });

  test('handles undefined lugarid gracefully', () => {
    mockLocation.state = {};
    
    render(
      <MemoryRouter>
        <InterfazMedico />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('busqueda-mensual')).toBeInTheDocument();
  });
});