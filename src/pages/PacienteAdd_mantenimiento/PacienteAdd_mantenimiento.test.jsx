import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PacienteAdd_mantenimiento from "./PacienteAdd_mantenimiento";
import Axios from "axios";

// Mock utils
jest.mock("../../utils/sanitizer", () => ({
  validateAndSanitize: jest.fn((value, opts) => ({
    isValid: value.trim() !== "",
    sanitizedValue: value,
    error: value.trim() === "" ? "Campo requerido" : "",
  })),
  isValidDPI: jest.fn((value) => /^\d{13}$/.test(value)),
  isValidPhone: jest.fn((value) => /^\+?\d{8,15}$/.test(value)),
}));

jest.mock("axios");

describe("PacienteAdd_mantenimiento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    Axios.post.mockResolvedValue({ data: { ok: true } });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza todos los campos del formulario", () => {
    render(<PacienteAdd_mantenimiento />);
    
    expect(screen.getByPlaceholderText(/Escriba el nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el apellido/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba la dirección completa/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el teléfono/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba la masa corporal/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba la altura/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el peso/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba las adicciones/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba la evolución médica/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el estatus/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Escriba el DPI/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Agregar Paciente/i })).toBeInTheDocument();
  });

  it("valida longitud máxima de nombre en tiempo real", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputNombre = screen.getByPlaceholderText(/Escriba el nombre/i);
    
    fireEvent.change(inputNombre, { target: { value: "a".repeat(101) } });
    
    expect(screen.getByText(/Máximo 100 caracteres/i)).toBeInTheDocument();
  });

  it("valida longitud máxima de apellido en tiempo real", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputApellido = screen.getByPlaceholderText(/Escriba el apellido/i);
    
    fireEvent.change(inputApellido, { target: { value: "a".repeat(101) } });
    
    expect(screen.getByText(/Máximo 100 caracteres/i)).toBeInTheDocument();
  });

  it("valida longitud máxima de dirección en tiempo real", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputDireccion = screen.getByPlaceholderText(/Escriba la dirección completa/i);
    
    fireEvent.change(inputDireccion, { target: { value: "a".repeat(201) } });
    
    expect(screen.getByText(/Máximo 200 caracteres/i)).toBeInTheDocument();
  });

  it("valida teléfono inválido en tiempo real", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputTelefono = screen.getByPlaceholderText(/Escriba el teléfono/i);
    
    fireEvent.change(inputTelefono, { target: { value: "abc" } });
    
    expect(screen.getByText(/Teléfono inválido/i)).toBeInTheDocument();
  });

  it("valida masa corporal debe ser número positivo", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputMasa = screen.getByPlaceholderText(/Escriba la masa corporal/i);
    
    fireEvent.change(inputMasa, { target: { value: "-5" } });
    
    expect(screen.getByText(/Debe ser un número positivo/i)).toBeInTheDocument();
  });

  it("valida altura debe ser número positivo", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputAltura = screen.getByPlaceholderText(/Escriba la altura/i);
    
    fireEvent.change(inputAltura, { target: { value: "0" } });
    
    expect(screen.getByText(/Debe ser un número positivo/i)).toBeInTheDocument();
  });

  it("valida peso debe ser número positivo", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputPeso = screen.getByPlaceholderText(/Escriba el peso/i);
    
    fireEvent.change(inputPeso, { target: { value: "-10" } });
    
    expect(screen.getByText(/Debe ser un número positivo/i)).toBeInTheDocument();
  });

  it("valida longitud máxima de adicciones en tiempo real", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputAdicciones = screen.getByPlaceholderText(/Escriba las adicciones/i);
    
    fireEvent.change(inputAdicciones, { target: { value: "a".repeat(501) } });
    
    expect(screen.getByText(/Máximo 500 caracteres/i)).toBeInTheDocument();
  });

  it("valida longitud máxima de evolución en tiempo real", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputEvolucion = screen.getByPlaceholderText(/Escriba la evolución médica/i);
    
    fireEvent.change(inputEvolucion, { target: { value: "a".repeat(1001) } });
    
    expect(screen.getByText(/Máximo 1000 caracteres/i)).toBeInTheDocument();
  });

  it("valida longitud máxima de status en tiempo real", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputStatus = screen.getByPlaceholderText(/Escriba el estatus/i);
    
    fireEvent.change(inputStatus, { target: { value: "a".repeat(51) } });
    
    expect(screen.getByText(/Máximo 50 caracteres/i)).toBeInTheDocument();
  });

  it("valida DPI debe tener exactamente 13 dígitos", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputDPI = screen.getByPlaceholderText(/Escriba el DPI/i);
    
    fireEvent.change(inputDPI, { target: { value: "123" } });
    
    expect(screen.getByText(/DPI debe tener exactamente 13 dígitos/i)).toBeInTheDocument();
  });

  it("limpia errores cuando el valor es válido", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputNombre = screen.getByPlaceholderText(/Escriba el nombre/i);
    
    // Primero ingresa un valor inválido (muy largo)
    fireEvent.change(inputNombre, { target: { value: "a".repeat(101) } });
    expect(screen.getByText(/Máximo 100 caracteres/i)).toBeInTheDocument();
    
    // Luego ingresa un valor válido
    fireEvent.change(inputNombre, { target: { value: "Juan" } });
    expect(screen.queryByText(/Máximo 100 caracteres/i)).not.toBeInTheDocument();
  });

  it("agrega paciente exitosamente con todos los datos", async () => {
    Axios.post.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteAdd_mantenimiento />);
    
    fireEvent.change(screen.getByPlaceholderText(/Escriba el nombre/i), { target: { value: "Juan" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el apellido/i), { target: { value: "Pérez" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la dirección completa/i), { target: { value: "Calle Principal 123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el teléfono/i), { target: { value: "+50212345678" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la masa corporal/i), { target: { value: "75" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la altura/i), { target: { value: "180" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el peso/i), { target: { value: "75" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba las adicciones/i), { target: { value: "Ninguna" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la evolución médica/i), { target: { value: "Sin problemas de salud" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el estatus/i), { target: { value: "Activo" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el DPI/i), { target: { value: "1234567890123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Agregar Paciente/i }));
    
    await waitFor(() => {
      expect(Axios.post).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Paciente agregado exitosamente");
    });
  });

  it("limpia el formulario después de agregar paciente exitosamente", async () => {
    Axios.post.mockResolvedValueOnce({ data: { ok: true } });
    render(<PacienteAdd_mantenimiento />);
    
    const inputNombre = screen.getByPlaceholderText(/Escriba el nombre/i);
    const inputApellido = screen.getByPlaceholderText(/Escriba el apellido/i);
    
    fireEvent.change(inputNombre, { target: { value: "Juan" } });
    fireEvent.change(inputApellido, { target: { value: "Pérez" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la dirección completa/i), { target: { value: "Calle Principal 123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el teléfono/i), { target: { value: "+50212345678" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la masa corporal/i), { target: { value: "75" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la altura/i), { target: { value: "180" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el peso/i), { target: { value: "75" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba las adicciones/i), { target: { value: "Ninguna" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la evolución médica/i), { target: { value: "Sin problemas de salud" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el estatus/i), { target: { value: "Activo" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el DPI/i), { target: { value: "1234567890123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Agregar Paciente/i }));
    
    await waitFor(() => {
      expect(inputNombre.value).toBe("");
      expect(inputApellido.value).toBe("");
    });
  });

  it("muestra error cuando falla la petición al servidor", async () => {
    Axios.post.mockRejectedValueOnce(new Error("Error de conexión"));
    render(<PacienteAdd_mantenimiento />);
    
    fireEvent.change(screen.getByPlaceholderText(/Escriba el nombre/i), { target: { value: "Juan" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el apellido/i), { target: { value: "Pérez" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la dirección completa/i), { target: { value: "Calle Principal 123" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el teléfono/i), { target: { value: "+50212345678" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la masa corporal/i), { target: { value: "75" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la altura/i), { target: { value: "180" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el peso/i), { target: { value: "75" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba las adicciones/i), { target: { value: "Ninguna" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba la evolución médica/i), { target: { value: "Sin problemas de salud" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el estatus/i), { target: { value: "Activo" } });
    fireEvent.change(screen.getByPlaceholderText(/Escriba el DPI/i), { target: { value: "1234567890123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Agregar Paciente/i }));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
    });
  });

  it("muestra error cuando campo requerido está vacío", async () => {
    render(<PacienteAdd_mantenimiento />);
    
    // Intenta agregar sin llenar campos (están vacíos)
    fireEvent.click(screen.getByRole("button", { name: /Agregar Paciente/i }));
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
    });
  });

  it("valida teléfono vacío no muestra error", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputTelefono = screen.getByPlaceholderText(/Escriba el teléfono/i);
    
    fireEvent.change(inputTelefono, { target: { value: "abc" } });
    expect(screen.getByText(/Teléfono inválido/i)).toBeInTheDocument();
    
    fireEvent.change(inputTelefono, { target: { value: "" } });
    expect(screen.queryByText(/Teléfono inválido/i)).not.toBeInTheDocument();
  });

  it("valida DPI vacío no muestra error", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputDPI = screen.getByPlaceholderText(/Escriba el DPI/i);
    
    fireEvent.change(inputDPI, { target: { value: "123" } });
    expect(screen.getByText(/DPI debe tener exactamente 13 dígitos/i)).toBeInTheDocument();
    
    fireEvent.change(inputDPI, { target: { value: "" } });
    expect(screen.queryByText(/DPI debe tener exactamente 13 dígitos/i)).not.toBeInTheDocument();
  });

  it("valida masa corporal vacía no muestra error", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputMasa = screen.getByPlaceholderText(/Escriba la masa corporal/i);
    
    fireEvent.change(inputMasa, { target: { value: "-5" } });
    expect(screen.getByText(/Debe ser un número positivo/i)).toBeInTheDocument();
    
    fireEvent.change(inputMasa, { target: { value: "" } });
    expect(screen.queryByText(/Debe ser un número positivo/i)).not.toBeInTheDocument();
  });

  it("valida altura vacía no muestra error", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputAltura = screen.getByPlaceholderText(/Escriba la altura/i);
    
    fireEvent.change(inputAltura, { target: { value: "-5" } });
    expect(screen.queryAllByText(/Debe ser un número positivo/i).length).toBeGreaterThan(0);
    
    fireEvent.change(inputAltura, { target: { value: "" } });
    // Solo debe haber un error de peso
    expect(screen.queryAllByText(/Debe ser un número positivo/i).length).toBe(0);
  });

  it("valida peso vacío no muestra error", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputPeso = screen.getByPlaceholderText(/Escriba el peso/i);
    
    fireEvent.change(inputPeso, { target: { value: "-5" } });
    expect(screen.queryAllByText(/Debe ser un número positivo/i).length).toBeGreaterThan(0);
    
    fireEvent.change(inputPeso, { target: { value: "" } });
    expect(screen.queryAllByText(/Debe ser un número positivo/i).length).toBe(0);
  });

  it("renderiza texto de campos requeridos", () => {
    render(<PacienteAdd_mantenimiento />);
    expect(screen.getByText(/Campos requeridos/i)).toBeInTheDocument();
  });

  it("valida teléfono válido no muestra error", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputTelefono = screen.getByPlaceholderText(/Escriba el teléfono/i);
    
    fireEvent.change(inputTelefono, { target: { value: "+50212345678" } });
    
    expect(screen.queryByText(/Teléfono inválido/i)).not.toBeInTheDocument();
  });

  it("valida DPI válido no muestra error", () => {
    render(<PacienteAdd_mantenimiento />);
    const inputDPI = screen.getByPlaceholderText(/Escriba el DPI/i);
    
    fireEvent.change(inputDPI, { target: { value: "1234567890123" } });
    
    expect(screen.queryByText(/DPI debe tener exactamente 13 dígitos/i)).not.toBeInTheDocument();
  });
});