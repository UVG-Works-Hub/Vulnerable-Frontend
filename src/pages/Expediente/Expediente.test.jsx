import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Axios from 'axios';
import Expediente from './Expediente';

// Axios
jest.mock('axios');

jest.mock('../../components', () => ({
  ShowAllPacientes: ({ json }) => {
    if (typeof json === 'string') return <div>{json}</div>;
    if (Array.isArray(json)) {
      return <div>{json.map((item, index) => <div key={index}>{item.nombre}</div>)}</div>;
    }
    return null;
  },
  ShowAllExamenes: ({ json }) => {
    if (typeof json === 'string') return <div>{json}</div>;
    if (Array.isArray(json)) {
      return <div>{json.map((item, index) => <div key={index}>{item.examen}</div>)}</div>;
    }
    return null;
  },
  ShowAllCirugias: ({ json }) => {
    if (typeof json === 'string') return <div>{json}</div>;
    if (Array.isArray(json)) {
      return <div>{json.map((item, index) => <div key={index}>{item.cirugia}</div>)}</div>;
    }
    return null;
  },
  ShowAllMedicosPaciente: ({ json }) => {
    if (typeof json === 'string') return <div>{json}</div>;
    if (Array.isArray(json)) {
      return <div>{json.map((item, index) => <div key={index}>{item.medico}</div>)}</div>;
    }
    return null;
  },
  ShowAllMedicamentos: ({ json }) => {
    if (typeof json === 'string') return <div>{json}</div>;
    if (Array.isArray(json)) {
      return <div>{json.map((item, index) => <div key={index}>{item.medicamento}</div>)}</div>;
    }
    return null;
  },
  ShowAllLugaresVisitados: ({ json }) => {
    if (typeof json === 'string') return <div>{json}</div>;
    if (Array.isArray(json)) {
      return <div>{json.map((item, index) => <div key={index}>{item.lugar}</div>)}</div>;
    }
    return null;
  },
  ShowAllVisitas: ({ json }) => {
    if (typeof json === 'string') return <div>{json}</div>;
    if (Array.isArray(json)) {
      return <div>{json.map((item, index) => <div key={index}>{item.fecha}</div>)}</div>;
    }
    return null;
  }
}));

describe('Expediente Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the input and submit button', () => {
    render(<Expediente />);
    expect(screen.getByPlaceholderText(/Ingrese el dpi del paciente/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test('renders all section titles', () => {
    render(<Expediente />);
    expect(screen.getByText(/Datos Paciente/i)).toBeInTheDocument();
    expect(screen.getByText(/Visitas Completas del Paciente/i)).toBeInTheDocument();
    expect(screen.getByText(/Examenes Paciente/i)).toBeInTheDocument();
    expect(screen.getByText(/Cirugías practicadas/i)).toBeInTheDocument();
    expect(screen.getByText(/Medicos que trataron al paciente/i)).toBeInTheDocument();
    expect(screen.getByText(/Medicamentos y evolucion/i)).toBeInTheDocument();
    expect(screen.getByText(/Centros de Salud Visitados/i)).toBeInTheDocument();
  });

  test('updates input text when typing', () => {
    render(<Expediente />);
    const input = screen.getByPlaceholderText(/Ingrese el dpi del paciente/i);
    
    fireEvent.change(input, { target: { value: '1234567890101' } });
    
    expect(input.value).toBe('1234567890101');
  });

  test('fetches and displays all data successfully', async () => {
    const mockPacienteData = { data: [{ nombre: 'Juan Pérez', dpi: '1234567890101' }] };
    const mockVisitasData = { data: [{ fecha: '2023-01-01', motivo: 'Control' }] };
    const mockExamenesData = { data: [{ examen: 'Sangre', resultado: 'Normal' }] };
    const mockCirugiasData = { data: [{ cirugia: 'Apendicectomía', fecha: '2022-12-01' }] };
    const mockMedicosData = { data: [{ medico: 'Dr. Smith', especialidad: 'Cirujano' }] };
    const mockMedicamentosData = { data: [{ medicamento: 'Paracetamol', dosis: '500mg' }] };
    const mockLugaresData = { data: [{ lugar: 'Hospital Central', fecha: '2023-01-01' }] };

    Axios.get.mockImplementation((url) => {
      if (url.includes('/pacientes/')) return Promise.resolve(mockPacienteData);
      if (url.includes('/get_visitas_especific/')) return Promise.resolve(mockVisitasData);
      if (url.includes('/get_examenes/')) return Promise.resolve(mockExamenesData);
      if (url.includes('/get_cirugias/')) return Promise.resolve(mockCirugiasData);
      if (url.includes('/get_medicosOfPaciente/')) return Promise.resolve(mockMedicosData);
      if (url.includes('/get_medicamentosYevolucion/')) return Promise.resolve(mockMedicamentosData);
      if (url.includes('/get_lugares_visitados/')) return Promise.resolve(mockLugaresData);
      return Promise.reject(new Error('URL no encontrada'));
    });

    render(<Expediente />);
    const input = screen.getByPlaceholderText(/Ingrese el dpi del paciente/i);
    const button = screen.getByText(/Submit/i);

    fireEvent.change(input, { target: { value: '1234567890101' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Juan Pérez/i)).toBeInTheDocument();
    });

    expect(Axios.get).toHaveBeenCalledTimes(7);
    expect(Axios.get).toHaveBeenCalledWith('http://localhost:3000/api/v1/pacientes/1234567890101');
    expect(Axios.get).toHaveBeenCalledWith('http://localhost:3000/api/v1/visitas/get_visitas_especific/1234567890101');
  });

  test('handles error when fetching paciente data', async () => {
    Axios.get.mockRejectedValue(new Error('Error en la solicitud'));

    render(<Expediente />);
    const input = screen.getByPlaceholderText(/Ingrese el dpi del paciente/i);
    const button = screen.getByText(/Submit/i);

    fireEvent.change(input, { target: { value: '1234567890101' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getAllByText(/Hubo un error/i).length).toBeGreaterThan(0);
    });
  });

  test('sanitizes input before making API calls', async () => {
    const mockData = { data: [] };
    Axios.get.mockResolvedValue(mockData);

    render(<Expediente />);
    const input = screen.getByPlaceholderText(/Ingrese el dpi del paciente/i);
    const button = screen.getByText(/Submit/i);

    fireEvent.change(input, { target: { value: '<script>alert("XSS")</script>1234' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalled();
    });

    // Verificar que el input fue sanitizado
    const calls = Axios.get.mock.calls;
    calls.forEach(call => {
      expect(call[0]).not.toContain('<script>');
    });
  });

  test('does not display data before clicking submit', () => {
    render(<Expediente />);
    
    // Verificar que los componentes de visualización no se muestran inicialmente
    expect(screen.queryByText(/Juan Pérez/i)).not.toBeInTheDocument();
  });

  test('handles empty DPI input', async () => {
    const mockData = { data: [] };
    Axios.get.mockResolvedValue(mockData);

    render(<Expediente />);
    const button = screen.getByText(/Submit/i);

    fireEvent.click(button);

    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalled();
    });
  });
});