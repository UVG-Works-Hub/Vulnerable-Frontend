import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import MedicoUpdate_mantenimiento from "./MedicoUpdate_mantenimiento";
import Axios from "axios";

// Mock ShowAll para evitar problemas de import
jest.mock('@components', () => ({
  ShowAll: ({ json }) => <div data-testid="showall">{JSON.stringify(json)}</div>
}));

// Mock utils
jest.mock("../../utils/sanitizer", () => ({
  validateAndSanitize: jest.fn((value, opts) => ({
    isValid: value !== "INVALID",
    sanitizedValue: value,
    error: value === "INVALID" ? "Error" : "",
  })),
  isValidNumeroColegiado: jest.fn((value) => /^\d{4,8}$/.test(value)),
}));

jest.mock("axios");

describe("MedicoUpdate_mantenimiento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    Axios.get.mockResolvedValue({ data: [{ nombre: "Juan" }] });
    Axios.put.mockResolvedValue({ data: { ok: true } });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza los campos y botones principales", async () => {
    render(<MedicoUpdate_mantenimiento lugarid={1} />);
    await waitFor(() => expect(screen.getByTestId("showall")).toBeInTheDocument());
    expect(screen.getByPlaceholderText(/número de colegiado/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nuevo nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nuevo apellido/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nueva dirección/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nuevo teléfono/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nueva especialidad/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /cambiar/i }).length).toBeGreaterThan(0);
  });

  it("valida número de colegiado inválido y muestra error", async () => {
    render(<MedicoUpdate_mantenimiento lugarid={1} />);
    await waitFor(() => expect(screen.getByTestId("showall")).toBeInTheDocument());
    const input = screen.getByPlaceholderText(/número de colegiado/i);
    fireEvent.change(input, { target: { value: "abc" } });
    await waitFor(() => {
      expect(screen.getByText(/número de colegiado inválido/i)).toBeInTheDocument();
    });
  });

  it("valida longitud máxima de data y muestra error", async () => {
    render(<MedicoUpdate_mantenimiento lugarid={1} />);
    await waitFor(() => expect(screen.getByTestId("showall")).toBeInTheDocument());
    const input = screen.getByPlaceholderText(/nuevo nombre/i);
    fireEvent.change(input, { target: { value: "a".repeat(256) } });
    await waitFor(() => {
      const errors = screen.getAllByText(/máximo 255 caracteres/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it("actualiza nombre exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<MedicoUpdate_mantenimiento lugarid={1} />);
    await waitFor(() => expect(screen.getByTestId("showall")).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/número de colegiado/i), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText(/nuevo nombre/i), { target: { value: "Pedro" } });
    fireEvent.click(screen.getByRole("button", { name: /cambiar nombre/i }));
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("exitosamente"));
    });
  });

  it("actualiza apellido exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<MedicoUpdate_mantenimiento lugarid={1} />);
    await waitFor(() => expect(screen.getByTestId("showall")).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/número de colegiado/i), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText(/nuevo apellido/i), { target: { value: "Ramírez" } });
    fireEvent.click(screen.getByRole("button", { name: /cambiar apellido/i }));
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("exitosamente"));
    });
  });

  it("muestra error si axios falla al actualizar dirección", async () => {
    Axios.put.mockRejectedValueOnce(new Error("Hubo un error"));
    render(<MedicoUpdate_mantenimiento lugarid={1} />);
    await waitFor(() => expect(screen.getByTestId("showall")).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/número de colegiado/i), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText(/nueva dirección/i), { target: { value: "Calle Principal" } });
    fireEvent.click(screen.getByRole("button", { name: /cambiar dirección/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Error"));
    });
  });

  it("actualiza teléfono exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<MedicoUpdate_mantenimiento lugarid={1} />);
    await waitFor(() => expect(screen.getByTestId("showall")).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/número de colegiado/i), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText(/nuevo teléfono/i), { target: { value: "+50212345678" } });
    fireEvent.click(screen.getByRole("button", { name: /cambiar teléfono/i }));
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("exitosamente"));
    });
  });

  it("actualiza especialidad exitosamente", async () => {
    Axios.put.mockResolvedValueOnce({ data: { ok: true } });
    render(<MedicoUpdate_mantenimiento lugarid={1} />);
    await waitFor(() => expect(screen.getByTestId("showall")).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/número de colegiado/i), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText(/nueva especialidad/i), { target: { value: "Cardiología" } });
    fireEvent.click(screen.getByRole("button", { name: /cambiar especialidad/i }));
    await waitFor(() => {
      expect(Axios.put).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("exitosamente"));
    });
  });

  it("muestra loading mientras carga", () => {
    Axios.get.mockImplementationOnce(() => new Promise(() => {})); // never resolves
    render(<MedicoUpdate_mantenimiento lugarid={1} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});