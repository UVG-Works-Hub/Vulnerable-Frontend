import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Axios from 'axios';
import BusquedaMensual from './BusquedaMensual';

// Axios
jest.mock('axios');

jest.mock('../../components', () => ({
  ShowAllBusquedaMensual: ({ json }) => {
    if (typeof json === 'string') {
      return <div>{json}</div>;
    }
    if (Array.isArray(json)) {
      return (
        <div>
          {json.map((item, index) => (
            <div key={index}>{item.tipo}</div>
          ))}
        </div>
      );
    }
    return null;
  }
}));

describe('BusquedaMensual Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the button and title', () => {
    render(<BusquedaMensual lugarid={1} />);
    expect(screen.getByText(/Ver Busqueda Mensual/i)).toBeInTheDocument();
    const titles = screen.getAllByText(/Busqueda Mensual/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  test('calls getReporte and updates responseData', async () => {
    const mockData = { data: [{ tipo: 'Tipo1', valor: 'Valor1' }] };
    Axios.get.mockResolvedValueOnce(mockData);

    render(<BusquedaMensual lugarid={1} />);
    const button = screen.getByText(/Ver Busqueda Mensual/i);

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Tipo1/i)).toBeInTheDocument();
    });
    
    expect(Axios.get).toHaveBeenCalledWith('http://localhost:3000/api/v1/queries/reporte_mensual/1');
  });

  test('handles error in getReporte', async () => {
    Axios.get.mockRejectedValueOnce(new Error('Error en la solicitud'));

    render(<BusquedaMensual lugarid={1} />);
    const button = screen.getByText(/Ver Busqueda Mensual/i);

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Hubo un problema/i)).toBeInTheDocument();
    });
  });
});