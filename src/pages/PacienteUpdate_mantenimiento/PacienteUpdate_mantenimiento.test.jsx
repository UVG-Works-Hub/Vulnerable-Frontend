import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PacienteUpdate_mantenimiento from "./PacienteUpdate_mantenimiento";
import Axios from "axios";

// Mock ShowAllPacientes para evitar problemas de import
jest.mock('@components', () => ({
  ShowAllPacientes: ({ json }) => <div data-testid="showallpacientes">{JSON.stringify(json)}</div>
}));

// Mock utils
jest.mock("../../utils/sanitizer", () => ({
  validateAndSanitize: jest.fn((value, opts) => ({
    isValid: value.trim() !== "",
    sanitizedValue: value,
    error: value.trim() === "" ? "Campo requerido" : "",
  })),
  isValidDPI: jest.fn((value) => /^\d{13}$/.test(value)),
}));

jest.mock("axios");

describe("PacienteUpdate_mantenimiento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    Axios.get.mockResolvedValue({ data: [{ dpi: "1234567890123", nombre: "Juan" }] });
    Axios.put.mockResolvedValue({ data: { ok: true } });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza el componente con todos los campos", async () => {
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    expect(screen.getByPlaceholderText(/DPI/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el nuevo nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el nuevo apellido/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba la nueva direccion/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el nuevo telefono/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba la nueva masa corporal/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba la nueva altura/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el nuevo peso/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba las adicciones del paciente/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba la evolución médica del paciente/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el nuevo estatus/i)).toBeInTheDocument();
  });

  it("muestra Loading mientras carga datos", () => {
    Axios.get.mockImplementationOnce(() => new Promise(() => {})); // never resolves
    render(<PacienteUpdate_mantenimiento />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("valida DPI debe tener exactamente 13 dígitos", async () => {
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    const inputDPI = screen.getByPlaceholderText(/^DPI$/i);
    fireEvent.change(inputDPI, { target: { value: "123" } });
    
    expect(screen.getByText(/DPI debe tener exactamente 13 dígitos/i)).toBeInTheDocument();
  });

  it("valida longitud máxima de data en tiempo real", async () => {
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    const inputNombre = screen.getByPlaceholderText(/Escriba el nuevo nombre/i);
    fireEvent.change(inputNombre, { target: { value: "a".repeat(256) } });
    
    // Usa queryAllByText para múltiples elementos
    const errores = screen.queryAllByText(/Máximo 255 caracteres/i);
    expect(errores.length).toBeGreaterThan(0);
  });

  it("limpia errores de DPI cuando es válido", async () => {
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    const inputDPI = screen.getByPlaceholderText(/^DPI$/i);
    
    fireEvent.change(inputDPI, { target: { value: "123" } });
    expect(screen.getByText(/DPI debe tener exactamente 13 dígitos/i)).toBeInTheDocument();
    
    fireEvent.change(inputDPI, { target: { value: "1234567890123" } });
    expect(screen.queryByText(/DPI debe tener exactamente 13 dígitos/i)).not.toBeInTheDocument();
  });

  it("limpia errores de data cuando es válido", async () => {
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    const inputNombre = screen.getByPlaceholderText(/Escriba el nuevo nombre/i);
    
    fireEvent.change(inputNombre, { target: { value: "a".repeat(256) } });
    let errores = screen.queryAllByText(/Máximo 255 caracteres/i);
    expect(errores.length).toBeGreaterThan(0);
    
    fireEvent.change(inputNombre, { target: { value: "Juan" } });
    errores = screen.queryAllByText(/Máximo 255 caracteres/i);
    expect(errores.length).toBe(0);
  });

  it("actualiza nombre exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el nuevo nombre/i), { target: { value: "Pedro" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[0]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Nombre actualizado exitosamente");
    });
  });

  it("actualiza apellido exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el nuevo apellido/i), { target: { value: "Ramírez" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[1]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Apellido actualizado exitosamente");
    });
  });

  it("actualiza dirección exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la nueva direccion/i), { target: { value: "Calle Principal 123" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[2]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Dirección actualizada exitosamente");
    });
  });

  it("actualiza teléfono exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el nuevo telefono/i), { target: { value: "+50212345678" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[3]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Teléfono actualizado exitosamente");
    });
  });

  it("actualiza masa corporal exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la nueva masa corporal/i), { target: { value: "75" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[4]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Masa corporal actualizada exitosamente");
    });
  });

  it("actualiza altura exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la nueva altura/i), { target: { value: "180" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[5]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Altura actualizada exitosamente");
    });
  });

  it("actualiza peso exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el nuevo peso/i), { target: { value: "75" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[6]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Peso actualizado exitosamente");
    });
  });

  it("actualiza adicciones exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba las adicciones del paciente/i), { target: { value: "Ninguna" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[7]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Adicciones actualizadas exitosamente");
    });
  });

  it("actualiza evolución exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la evolución médica del paciente/i), { target: { value: "Sin problemas" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[8]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Evolución actualizada exitosamente");
    });
  });

  it("actualiza estatus exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el nuevo estatus/i), { target: { value: "Activo" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[9]);
    
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Status actualizado exitosamente");
    });
  });

  it("muestra error cuando falla la petición al actualizar nombre", async () => {
    Axios.put.mockRejectedValueOnce(new Error("Error de conexión"));
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    fireEvent.change(screen.getByPlaceholderText(/^DPI$/i), { target: { value: "1234567890123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el nuevo nombre/i), { target: { value: "Pedro" } });
    fireEvent.click(screen.getAllByRole("button", { name: /Cambiar/i })[0]);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
    });
  });

  it("valida DPI vacío no muestra error", async () => {
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    const inputDPI = screen.getByPlaceholderText(/^DPI$/i);
    fireEvent.change(inputDPI, { target: { value: "123" } });
    expect(screen.getByText(/DPI debe tener exactamente 13 dígitos/i)).toBeInTheDocument();
    
    fireEvent.change(inputDPI, { target: { value: "" } });
    expect(screen.queryByText(/DPI debe tener exactamente 13 dígitos/i)).not.toBeInTheDocument();
  });

  it("renderiza botones Cambiar para cada sección", async () => {
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => expect(screen.getByTestId("showallpacientes")).toBeInTheDocument());
    
    const botones = screen.getAllByRole("button", { name: /Cambiar/i });
    expect(botones.length).toBe(10);
  });

  it("carga pacientes al montar el componente", async () => {
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => {
      expect(Axios.get).toHaveBeenCalledWith("http://localhost:3000/api/v1/pacientes/");
      expect(screen.getByTestId("showallpacientes")).toBeInTheDocument();
    });
  });

  it("renderiza ShowAllPacientes con datos cargados", async () => {
    render(<PacienteUpdate_mantenimiento />);
    
    await waitFor(() => {
      const showAllComponent = screen.getByTestId("showallpacientes");
      expect(showAllComponent).toBeInTheDocument();
      expect(showAllComponent.textContent).toContain("1234567890123");
    });
  });
});