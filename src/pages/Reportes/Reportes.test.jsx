import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Reportes from "./Reportes";
import Axios from "axios";

// Desabilitar advertencias de act() en el ambiente de prueba
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') ||
       args[0].includes('Warning: The current testing environment'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock componentes
jest.mock('../../components', () => ({
  ShowAllTopMedicos: ({ json }) => <div data-testid="showtopmedicos">{JSON.stringify(json)}</div>,
  ShowAllEnfermedadesMortales: ({ json }) => <div data-testid="showenfermedades">{JSON.stringify(json)}</div>,
  ShowAllPacientesMasVisitas: ({ json }) => <div data-testid="showpacientesvisitas">{JSON.stringify(json)}</div>,
  ShowAllHospitalesMasPacientes: ({ json }) => <div data-testid="showhospitales">{JSON.stringify(json)}</div>,
}));

jest.mock("axios");

describe("Reportes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    Axios.get.mockImplementation((url) => {
      if (url.includes("top_medicos")) {
        return Promise.resolve({
          data: [
            { id: 1, nombre: "Dr. Juan", pacientes: 50 },
            { id: 2, nombre: "Dr. Pedro", pacientes: 45 }
          ]
        });
      }
      if (url.includes("enfermedades_mortales")) {
        return Promise.resolve({
          data: [
            { id: 1, nombre: "COVID-19", muertes: 100 },
            { id: 2, nombre: "Cáncer", muertes: 80 }
          ]
        });
      }
      if (url.includes("get_pacientesvisitas")) {
        return Promise.resolve({
          data: [
            { id: 1, nombre: "Paciente 1", visitas: 10 },
            { id: 2, nombre: "Paciente 2", visitas: 8 }
          ]
        });
      }
      if (url.includes("top_hospitales")) {
        return Promise.resolve({
          data: [
            { id: 1, nombre: "Hospital A", pacientes: 500 },
            { id: 2, nombre: "Hospital B", pacientes: 450 }
          ]
        });
      }
      return Promise.reject(new Error("URL no coincide"));
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza el componente con todos los títulos", () => {
    render(<Reportes />);
    
    expect(screen.getByText(/Médicos que han atendido más pacientes/i)).toBeInTheDocument();
    expect(screen.getByText(/Enfermedades más mortales/i)).toBeInTheDocument();
    expect(screen.getByText(/Pacientes que han visitado más una unidad de salud/i)).toBeInTheDocument();
    expect(screen.getByText(/Hospitales que han atendido a más pacientes/i)).toBeInTheDocument();
  });

  it("renderiza el botón Ver reporte", () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    expect(button).toBeInTheDocument();
    expect(button.type).toBe("submit");
  });

  it("no muestra componentes al inicio", () => {
    render(<Reportes />);
    
    expect(screen.queryByTestId("showtopmedicos")).not.toBeInTheDocument();
    expect(screen.queryByTestId("showenfermedades")).not.toBeInTheDocument();
    expect(screen.queryByTestId("showpacientesvisitas")).not.toBeInTheDocument();
    expect(screen.queryByTestId("showhospitales")).not.toBeInTheDocument();
  });

  it("carga todos los reportes al hacer clic en Ver reporte", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalledTimes(4);
    }, { timeout: 3000 });
  });

  it("muestra componente ShowAllTopMedicos después de cargar", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId("showtopmedicos")).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByTestId("showtopmedicos").textContent).toContain("Dr. Juan");
  });

  it("muestra componente ShowAllEnfermedadesMortales después de cargar", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId("showenfermedades")).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByTestId("showenfermedades").textContent).toContain("COVID-19");
  });

  it("muestra componente ShowAllPacientesMasVisitas después de cargar", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId("showpacientesvisitas")).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByTestId("showpacientesvisitas").textContent).toContain("Paciente 1");
  });

  it("muestra componente ShowAllHospitalesMasPacientes después de cargar", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId("showhospitales")).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByTestId("showhospitales").textContent).toContain("Hospital A");
  });

  it("maneja error al cargar top medicos", async () => {
    Axios.get.mockRejectedValueOnce(new Error("Error de conexión"));
    
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalled();
    });
  });

  it("maneja error al cargar enfermedades mortales", async () => {
    Axios.get.mockImplementation((url) => {
      if (url.includes("enfermedades_mortales")) {
        return Promise.reject(new Error("Error de conexión"));
      }
      return Promise.resolve({ data: [] });
    });
    
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalled();
    });
  });

  it("maneja error al cargar pacientes más visitas", async () => {
    Axios.get.mockImplementation((url) => {
      if (url.includes("get_pacientesvisitas")) {
        return Promise.reject(new Error("Error de conexión"));
      }
      return Promise.resolve({ data: [] });
    });
    
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalled();
    });
  });

  it("maneja error al cargar hospitales", async () => {
    Axios.get.mockImplementation((url) => {
      if (url.includes("top_hospitales")) {
        return Promise.reject(new Error("Error de conexión"));
      }
      return Promise.resolve({ data: [] });
    });
    
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalled();
    });
  });

  it("muestra mensaje de error cuando falla la carga de top medicos", async () => {
    Axios.get.mockRejectedValueOnce(new Error("Error de conexión"));
    
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId("showtopmedicos").textContent).toContain("Hubo un error");
    }, { timeout: 3000 });
  });

  it("carga datos correctos para top medicos", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      const medicoComponent = screen.getByTestId("showtopmedicos");
      expect(medicoComponent.textContent).toContain("Dr. Juan");
      expect(medicoComponent.textContent).toContain("50");
    }, { timeout: 3000 });
  });

  it("carga datos correctos para enfermedades mortales", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      const enfermedadesComponent = screen.getByTestId("showenfermedades");
      expect(enfermedadesComponent.textContent).toContain("COVID-19");
      expect(enfermedadesComponent.textContent).toContain("100");
    }, { timeout: 3000 });
  });

  it("carga datos correctos para pacientes más visitas", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      const pacientesComponent = screen.getByTestId("showpacientesvisitas");
      expect(pacientesComponent.textContent).toContain("Paciente 1");
      expect(pacientesComponent.textContent).toContain("10");
    }, { timeout: 3000 });
  });

  it("carga datos correctos para hospitales", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      const hospitalComponent = screen.getByTestId("showhospitales");
      expect(hospitalComponent.textContent).toContain("Hospital A");
      expect(hospitalComponent.textContent).toContain("500");
    }, { timeout: 3000 });
  });

  it("todos los componentes de reporte se muestran simultáneamente", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId("showtopmedicos")).toBeInTheDocument();
      expect(screen.getByTestId("showenfermedades")).toBeInTheDocument();
      expect(screen.getByTestId("showpacientesvisitas")).toBeInTheDocument();
      expect(screen.getByTestId("showhospitales")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("estructura HTML es correcta", () => {
    const { container } = render(<Reportes />);
    
    const headings = container.querySelectorAll("h2");
    expect(headings.length).toBe(4);
    
    const button = container.querySelector("button[type='submit']");
    expect(button).toBeTruthy();
  });

  it("verifica URLs correctas en las llamadas API", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalledWith("http://localhost:3000/api/v1/queries/top_medicos/");
      expect(Axios.get).toHaveBeenCalledWith("http://localhost:3000/api/v1/queries/enfermedades_mortales/");
      expect(Axios.get).toHaveBeenCalledWith("http://localhost:3000/api/v1/queries/get_pacientesvisitas/");
      expect(Axios.get).toHaveBeenCalledWith("http://localhost:3000/api/v1/queries/top_hospitales/");
    }, { timeout: 3000 });
  });

  it("renderiza el botón inicialmente y es clickeable", () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    expect(button).toBeEnabled();
    
    fireEvent.click(button);
    expect(button).toBeEnabled();
  });

  it("el botón permanece clickeable después de cargar reportes", async () => {
    render(<Reportes />);
    
    const button = screen.getByRole("button", { name: /Ver reporte/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId("showtopmedicos")).toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(button).toBeEnabled();
  });
});