import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Mantenimiento from './Mantenimiento';

// componentes hijos
jest.mock('../MedicoUpdate_mantenimiento', () => {
  return function MedicoUpdateMantenimiento({ lugarid }) {
    return <div data-testid="medico-update">Medico Update - Lugar ID: {lugarid}</div>;
  };
});

jest.mock('../MedicoAdd_mantenimiento', () => {
  return function MedicoAddMantenimiento({ lugarid }) {
    return <div data-testid="medico-add">Medico Add - Lugar ID: {lugarid}</div>;
  };
});

jest.mock('../PacienteAdd_mantenimiento', () => {
  return function PacienteAddMantenimiento() {
    return <div data-testid="paciente-add">Paciente Add</div>;
  };
});

jest.mock('../PacienteUpdate_mantenimiento', () => {
  return function PacienteUpdateMantenimiento() {
    return <div data-testid="paciente-update">Paciente Update</div>;
  };
});

jest.mock('../UsuarioUpdate_mantenimiento', () => {
  return function UsuarioUpdateMantenimiento({ lugid }) {
    return <div data-testid="usuario-update">Usuario Update - Lugar ID: {lugid}</div>;
  };
});

jest.mock('../UsuarioAdd_mantenimiento', () => {
  return function UsuarioAddMantenimiento({ lugid }) {
    return <div data-testid="usuario-add">Usuario Add - Lugar ID: {lugid}</div>;
  };
});

jest.mock('../Reportes', () => {
  return function Reportes() {
    return <div data-testid="reportes">Reportes</div>;
  };
});

// Mock de Clerk
jest.mock('@clerk/clerk-react', () => ({
  SignOutButton: ({ children, redirectUrl }) => (
    <div data-testid="signout-button" data-redirect-url={redirectUrl}>
      {children}
    </div>
  ),
}));

describe('Mantenimiento Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all navigation buttons', () => {
    render(<Mantenimiento />);
    
    expect(screen.getByRole('button', { name: /Actualizar Medico/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar Medico/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Actualizar Usuario/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar Usuario/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Actualizar Paciente/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar Paciente/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reporteria/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cerrar Sesión/i })).toBeInTheDocument();
  });

  test('renders MedicoUpdate component by default', () => {
    render(<Mantenimiento />);
    
    expect(screen.getByTestId('medico-update')).toBeInTheDocument();
    expect(screen.getByText(/Lugar ID: 2/i)).toBeInTheDocument();
  });

  test('switches to MedicoAdd when Agregar Medico button is clicked', () => {
    render(<Mantenimiento />);
    
    fireEvent.click(screen.getByRole('button', { name: /Agregar Medico/i }));
    
    expect(screen.getByTestId('medico-add')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-update')).not.toBeInTheDocument();
  });

  test('switches to UsuarioUpdate when Actualizar Usuario button is clicked', () => {
    render(<Mantenimiento />);
    
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Usuario/i }));
    
    expect(screen.getByTestId('usuario-update')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-update')).not.toBeInTheDocument();
  });

  test('switches to UsuarioAdd when Agregar Usuario button is clicked', () => {
    render(<Mantenimiento />);
    
    fireEvent.click(screen.getByRole('button', { name: /Agregar Usuario/i }));
    
    expect(screen.getByTestId('usuario-add')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-update')).not.toBeInTheDocument();
  });

  test('switches to PacienteUpdate when Actualizar Paciente button is clicked', () => {
    render(<Mantenimiento />);
    
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Paciente/i }));
    
    expect(screen.getByTestId('paciente-update')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-update')).not.toBeInTheDocument();
  });

  test('switches to PacienteAdd when Agregar Paciente button is clicked', () => {
    render(<Mantenimiento />);
    
    fireEvent.click(screen.getByRole('button', { name: /Agregar Paciente/i }));
    
    expect(screen.getByTestId('paciente-add')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-update')).not.toBeInTheDocument();
  });

  test('switches to Reportes when Reporteria button is clicked', () => {
    render(<Mantenimiento />);
    
    fireEvent.click(screen.getByRole('button', { name: /Reporteria/i }));
    
    expect(screen.getByTestId('reportes')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-update')).not.toBeInTheDocument();
  });

  test('switches back to MedicoUpdate when Actualizar Medico button is clicked after switching views', () => {
    render(<Mantenimiento />);
    
    // Cambiar a otra vista
    fireEvent.click(screen.getByRole('button', { name: /Agregar Medico/i }));
    expect(screen.getByTestId('medico-add')).toBeInTheDocument();
    
    // Volver a MedicoUpdate
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Medico/i }));
    expect(screen.getByTestId('medico-update')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-add')).not.toBeInTheDocument();
  });

  test('only one component is visible at a time', () => {
    render(<Mantenimiento />);
    
    // Estado inicial
    expect(screen.getByTestId('medico-update')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-add')).not.toBeInTheDocument();
    
    // Cambiar a Agregar Medico
    fireEvent.click(screen.getByRole('button', { name: /Agregar Medico/i }));
    expect(screen.getByTestId('medico-add')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-update')).not.toBeInTheDocument();
    expect(screen.queryByTestId('usuario-update')).not.toBeInTheDocument();
    
    // Cambiar a Usuario Update
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Usuario/i }));
    expect(screen.getByTestId('usuario-update')).toBeInTheDocument();
    expect(screen.queryByTestId('medico-add')).not.toBeInTheDocument();
    expect(screen.queryByTestId('medico-update')).not.toBeInTheDocument();
  });

  test('passes correct lugarid prop to medico components', () => {
    render(<Mantenimiento />);
    
    // Verificar MedicoUpdate
    expect(screen.getByText(/Lugar ID: 2/i)).toBeInTheDocument();
    
    // Cambiar a MedicoAdd
    fireEvent.click(screen.getByRole('button', { name: /Agregar Medico/i }));
    expect(screen.getByText(/Lugar ID: 2/i)).toBeInTheDocument();
  });

  test('passes correct lugid prop to usuario components', () => {
    render(<Mantenimiento />);
    
    // Cambiar a UsuarioUpdate
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Usuario/i }));
    expect(screen.getByText(/Lugar ID: 2/i)).toBeInTheDocument();
    
    // Cambiar a UsuarioAdd
    fireEvent.click(screen.getByRole('button', { name: /Agregar Usuario/i }));
    expect(screen.getByText(/Lugar ID: 2/i)).toBeInTheDocument();
  });

  test('renders SignOutButton with correct props', () => {
    render(<Mantenimiento />);
    
    const signOutButton = screen.getByTestId('signout-button');
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute('data-redirect-url', '/login');
  });

  test('navigation buttons are always visible regardless of active view', () => {
    render(<Mantenimiento />);
    
    const views = [
      { button: /Agregar Medico/i, testId: 'medico-add' },
      { button: /Actualizar Usuario/i, testId: 'usuario-update' },
      { button: /Agregar Usuario/i, testId: 'usuario-add' },
      { button: /Actualizar Paciente/i, testId: 'paciente-update' },
      { button: /Agregar Paciente/i, testId: 'paciente-add' },
      { button: /Reporteria/i, testId: 'reportes' },
    ];

    views.forEach(({ button }) => {
      fireEvent.click(screen.getByRole('button', { name: button }));
      
      // Verificar que todos los botones siguen presentes
      expect(screen.getByRole('button', { name: /Actualizar Medico/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Agregar Medico/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Actualizar Usuario/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Agregar Usuario/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Actualizar Paciente/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Agregar Paciente/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reporteria/i })).toBeInTheDocument();
    });
  });

  test('complete navigation cycle', () => {
    render(<Mantenimiento />);
    
    // MedicoUpdate (default)
    expect(screen.getByTestId('medico-update')).toBeInTheDocument();
    
    // MedicoAdd
    fireEvent.click(screen.getByRole('button', { name: /Agregar Medico/i }));
    expect(screen.getByTestId('medico-add')).toBeInTheDocument();
    
    // UsuarioUpdate
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Usuario/i }));
    expect(screen.getByTestId('usuario-update')).toBeInTheDocument();
    
    // UsuarioAdd
    fireEvent.click(screen.getByRole('button', { name: /Agregar Usuario/i }));
    expect(screen.getByTestId('usuario-add')).toBeInTheDocument();
    
    // PacienteUpdate
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Paciente/i }));
    expect(screen.getByTestId('paciente-update')).toBeInTheDocument();
    
    // PacienteAdd
    fireEvent.click(screen.getByRole('button', { name: /Agregar Paciente/i }));
    expect(screen.getByTestId('paciente-add')).toBeInTheDocument();
    
    // Reportes
    fireEvent.click(screen.getByRole('button', { name: /Reporteria/i }));
    expect(screen.getByTestId('reportes')).toBeInTheDocument();
    
    // Volver a MedicoUpdate
    fireEvent.click(screen.getByRole('button', { name: /Actualizar Medico/i }));
    expect(screen.getByTestId('medico-update')).toBeInTheDocument();
  });
});