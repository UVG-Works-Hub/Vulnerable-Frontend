import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MedicoAdd_mantenimiento from "./MedicoAdd_mantenimiento";
import '@testing-library/jest-dom';
import Axios from "axios";

// Mock utils
jest.mock("../../utils/sanitizer", () => ({
  validateAndSanitize: jest.fn((value, opts) => ({
    isValid: value !== "INVALID",
    sanitizedValue: value,
    error: value === "INVALID" ? "Error" : "",
  })),
  isValidNumeroColegiado: jest.fn((value) => /^\d{4,8}$/.test(value)),
  isValidPhone: jest.fn((value) => /^\+?\d{8,15}$/.test(value)),
}));

jest.mock("axios");

describe("MedicoAdd_mantenimiento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("renderiza todos los campos y el botón", () => {
    render(<MedicoAdd_mantenimiento lugarid={5} />);
    expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/colegiado/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/especialidad/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /agregar médico/i })).toBeInTheDocument();
  });

  it("valida longitud máxima de nombre y muestra error", () => {
    render(<MedicoAdd_mantenimiento />);
    const input = screen.getByPlaceholderText(/nombre/i);
    fireEvent.change(input, { target: { value: "a".repeat(101) } });
    expect(screen.getByText(/máximo 100 caracteres/i)).toBeInTheDocument();
  });

  it("valida longitud máxima de apellido y muestra error", () => {
    render(<MedicoAdd_mantenimiento />);
    const input = screen.getByPlaceholderText(/apellido/i);
    fireEvent.change(input, { target: { value: "b".repeat(101) } });
    expect(screen.getByText(/máximo 100 caracteres/i)).toBeInTheDocument();
  });

  it("valida longitud máxima de dirección y muestra error", () => {
    render(<MedicoAdd_mantenimiento />);
    const input = screen.getByPlaceholderText(/dirección/i);
    fireEvent.change(input, { target: { value: "c".repeat(201) } });
    expect(screen.getByText(/máximo 200 caracteres/i)).toBeInTheDocument();
  });

  it("valida teléfono inválido y muestra error", () => {
    const { container } = render(<MedicoAdd_mantenimiento />);
    const input = screen.getByPlaceholderText(/teléfono/i);
    fireEvent.change(input, { target: { value: "abc" } });
    expect(container.textContent).toMatch(/teléfono inválido/i);
  });

  it("valida número de colegiado inválido y muestra error", () => {
    render(<MedicoAdd_mantenimiento />);
    const input = screen.getByPlaceholderText(/colegiado/i);
    fireEvent.change(input, { target: { value: "12" } });
    expect(screen.getByText(/número de colegiado inválido/i)).toBeInTheDocument();
  });

  it("valida longitud máxima de especialidad y muestra error", () => {
    render(<MedicoAdd_mantenimiento />);
    const input = screen.getByPlaceholderText(/especialidad/i);
    fireEvent.change(input, { target: { value: "d".repeat(101) } });
    expect(screen.getByText(/máximo 100 caracteres/i)).toBeInTheDocument();
  });

  it("muestra error si algún campo es inválido al enviar", async () => {
    const { validateAndSanitize } = require("../../utils/sanitizer");
    validateAndSanitize.mockImplementationOnce(() => ({
      isValid: false,
      error: "Campo requerido",
    }));
    render(<MedicoAdd_mantenimiento />);
    fireEvent.click(screen.getByRole("button", { name: /agregar médico/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Error"));
    });
  });

  it("envía el formulario correctamente y limpia los campos", async () => {
    Axios.post.mockResolvedValueOnce({ data: { ok: true } });
    render(<MedicoAdd_mantenimiento lugarid={3} />);
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: "Juan" } });
    fireEvent.change(screen.getByPlaceholderText(/apellido/i), { target: { value: "Pérez" } });
    fireEvent.change(screen.getByPlaceholderText(/dirección/i), { target: { value: "Calle 1" } });
    fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: "+50212345678" } });
    fireEvent.change(screen.getByPlaceholderText(/colegiado/i), { target: { value: "12345" } });
    fireEvent.change(screen.getByPlaceholderText(/especialidad/i), { target: { value: "Cardiología" } });

    fireEvent.click(screen.getByRole("button", { name: /agregar médico/i }));

    await waitFor(() => {
      expect(Axios.post).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("exitosamente"));
    });
    // Los campos deben estar vacíos después del éxito
    expect(screen.getByPlaceholderText(/nombre/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/apellido/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/dirección/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/teléfono/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/colegiado/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/especialidad/i)).toHaveValue("");
  });

  it("muestra error si axios falla", async () => {
    Axios.post.mockRejectedValueOnce(new Error("Hubo un error"));
    render(<MedicoAdd_mantenimiento lugarid={1} />);
    fireEvent.change(screen.getByPlaceholderText(/nombre/i), { target: { value: "Juan" } });
    fireEvent.change(screen.getByPlaceholderText(/apellido/i), { target: { value: "Pérez" } });
    fireEvent.change(screen.getByPlaceholderText(/dirección/i), { target: { value: "Calle 1" } });
    fireEvent.change(screen.getByPlaceholderText(/teléfono/i), { target: { value: "+50212345678" } });
    fireEvent.change(screen.getByPlaceholderText(/colegiado/i), { target: { value: "12345" } });
    fireEvent.change(screen.getByPlaceholderText(/especialidad/i), { target: { value: "Cardiología" } });

    fireEvent.click(screen.getByRole("button", { name: /agregar médico/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Error"));
    });
  });
});