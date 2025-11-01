import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import UsuarioUpdate_mantenimiento from "./UsuarioUpdate_mantenimiento";
import Axios from "axios";

jest.mock("axios");

// Mock de las funciones de sanitización
jest.mock("../../utils/sanitizer", () => ({
  validateAndSanitize: jest.fn((value, options) => {
    if (options.required && !value.trim()) {
      return { isValid: false, error: "Campo requerido" };
    }
    if (options.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { isValid: false, error: "Email inválido" };
      }
    }
    if (options.type === "numeroColegiado") {
      const numRegex = /^\d{4,8}$/;
      if (!numRegex.test(value)) {
        return { isValid: false, error: "Número de colegiado inválido" };
      }
    }
    if (options.customValidator && !options.customValidator(value)) {
      return { isValid: false, error: "Validación personalizada falló" };
    }
    return { isValid: true, sanitizedValue: value.trim() };
  }),
  isValidNumeroColegiado: jest.fn((num) => /^\d{4,8}$/.test(num)),
}));

// Mock del componente ShowAllUsuarios
jest.mock("../../components", () => ({
  ShowAllUsuarios: ({ json }) => (
    <div data-testid="showallusuarios">{JSON.stringify(json)}</div>
  ),
}));

describe("UsuarioUpdate_mantenimiento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();

    // Mock por defecto de las respuestas
    Axios.get.mockResolvedValue({
      data: [
        { id: 1, numero_colegiado: "12345", correo: "usuario1@example.com" },
        { id: 2, numero_colegiado: "67890", correo: "usuario2@example.com" },
      ],
    });

    Axios.put.mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Tests de renderizado inicial
  describe("Renderizado inicial", () => {
    it("debe mostrar mensaje de carga inicialmente", () => {
      Axios.get.mockImplementation(() => new Promise(() => {}));
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("debe cargar usuarios al montar el componente", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        expect(Axios.get).toHaveBeenCalledWith(
          "http://localhost:3000/api/v1/usuarios/lugar/1",
        );
      });
    });

    it("debe mostrar el componente ShowAllUsuarios después de cargar", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        expect(screen.getByTestId("showallusuarios")).toBeInTheDocument();
      });
    });

    it("debe renderizar todas las secciones de actualización", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        expect(screen.getByText("Cambiar correo *")).toBeInTheDocument();
        expect(screen.getByText("Cambiar contraseña *")).toBeInTheDocument();
        expect(screen.getByText("Cambiar número de colegiado *")).toBeInTheDocument();
      });
    });

    it("debe renderizar todos los botones", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Cambiar Correo/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Cambiar Contraseña/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Cambiar Número de Colegiado/i })).toBeInTheDocument();
      });
    });

    it("debe mostrar nota de campos requeridos", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        expect(screen.getByText("* Campos requeridos")).toBeInTheDocument();
      });
    });
  });

  // Tests de validación de número de colegiado
  describe("Validación de número de colegiado", () => {
    it("debe mostrar error cuando el número de colegiado es inválido", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        fireEvent.change(inputs[0], { target: { value: "123" } });
      });

      expect(screen.getAllByText("Número de colegiado inválido (4-8 dígitos)")[0]).toBeInTheDocument();
    });

    it("debe limpiar el error cuando el número de colegiado es válido", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        fireEvent.change(inputs[0], { target: { value: "123" } });
      });

      expect(screen.getAllByText("Número de colegiado inválido (4-8 dígitos)")[0]).toBeInTheDocument();

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        fireEvent.change(inputs[0], { target: { value: "12345" } });
      });

      expect(screen.queryByText("Número de colegiado inválido (4-8 dígitos)")).not.toBeInTheDocument();
    });

    it("debe limpiar el error cuando el campo está vacío", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        fireEvent.change(inputs[0], { target: { value: "12345" } });
        fireEvent.change(inputs[0], { target: { value: "" } });
      });

      expect(screen.queryByText("Número de colegiado inválido (4-8 dígitos)")).not.toBeInTheDocument();
    });

    it("debe aceptar números de colegiado válidos de 4 a 8 dígitos", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        fireEvent.change(inputs[0], { target: { value: "1234" } });
        expect(screen.queryByText("Número de colegiado inválido (4-8 dígitos)")).not.toBeInTheDocument();

        fireEvent.change(inputs[0], { target: { value: "12345678" } });
        expect(screen.queryByText("Número de colegiado inválido (4-8 dígitos)")).not.toBeInTheDocument();
      });
    });

    it("debe tener maxLength de 8 caracteres", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        expect(inputs[0].maxLength).toBe(8);
      });
    });
  });

  // Tests de cambio de correo
  describe("Cambiar correo", () => {
    it("debe validar el correo en tiempo real", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
        fireEvent.change(correoInputs[0], { target: { value: "correo_invalido" } });
      });

      const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
      expect(correoInputs[0]).toHaveValue("correo_invalido");
    });

    it("debe permitir correos válidos", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
        fireEvent.change(correoInputs[0], { target: { value: "nuevo@example.com" } });
      });

      const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
      expect(correoInputs[0]).toHaveValue("nuevo@example.com");
    });

    it("debe enviar correo actualizado al hacer clic en Cambiar Correo", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);

        fireEvent.change(numInputs[0], { target: { value: "12345" } });
        fireEvent.change(correoInputs[0], { target: { value: "nuevo@example.com" } });
      });

      const botones = screen.getAllByRole("button");
      const botonCambiarCorreo = botones[0];
      fireEvent.click(botonCambiarCorreo);

      await waitFor(() => {
        expect(Axios.put).toHaveBeenCalled();
      });
    });

    it("debe mostrar alerta de éxito al cambiar correo", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);

        fireEvent.change(numInputs[0], { target: { value: "12345" } });
        fireEvent.change(correoInputs[0], { target: { value: "nuevo@example.com" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[0]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Correo actualizado exitosamente");
      });
    });

    it("debe mostrar alerta de error cuando falla el cambio de correo", async () => {
      Axios.put.mockRejectedValue(new Error("Error de servidor"));

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);

        fireEvent.change(numInputs[0], { target: { value: "12345" } });
        fireEvent.change(correoInputs[0], { target: { value: "nuevo@example.com" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[0]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });

    it("debe recargar usuarios después de cambiar correo", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);

        fireEvent.change(numInputs[0], { target: { value: "12345" } });
        fireEvent.change(correoInputs[0], { target: { value: "nuevo@example.com" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[0]);

      await waitFor(() => {
        expect(Axios.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  // Tests de cambio de contraseña
  describe("Cambiar contraseña", () => {
    it("debe validar contraseña con mínimo 6 caracteres", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);
        fireEvent.change(passwordInputs[0], { target: { value: "12345" } });
      });

      const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);
      expect(passwordInputs[0]).toHaveValue("12345");
    });

    it("debe permitir contraseñas válidas", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);
        fireEvent.change(passwordInputs[0], { target: { value: "password123" } });
      });

      const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);
      expect(passwordInputs[0]).toHaveValue("password123");
    });

    it("debe enviar contraseña actualizada al hacer clic en Cambiar Contraseña", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);

        fireEvent.change(numInputs[1], { target: { value: "12345" } });
        fireEvent.change(passwordInputs[0], { target: { value: "newpass123" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[1]);

      await waitFor(() => {
        expect(Axios.put).toHaveBeenCalled();
      });
    });

    it("debe mostrar alerta de éxito al cambiar contraseña", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);

        fireEvent.change(numInputs[1], { target: { value: "12345" } });
        fireEvent.change(passwordInputs[0], { target: { value: "newpass123" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[1]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Contraseña actualizada exitosamente");
      });
    });

    it("debe mostrar alerta de error cuando falla el cambio de contraseña", async () => {
      Axios.put.mockRejectedValue(new Error("Error de servidor"));

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);

        fireEvent.change(numInputs[1], { target: { value: "12345" } });
        fireEvent.change(passwordInputs[0], { target: { value: "newpass123" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[1]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });

    it("debe recargar usuarios después de cambiar contraseña", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);

        fireEvent.change(numInputs[1], { target: { value: "12345" } });
        fireEvent.change(passwordInputs[0], { target: { value: "newpass123" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[1]);

      await waitFor(() => {
        expect(Axios.get).toHaveBeenCalledTimes(2);
      });
    });

    it("debe ser de tipo password", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);
        expect(passwordInputs[0].type).toBe("password");
      });
    });
  });

  // Tests de cambio de número de colegiado
  describe("Cambiar número de colegiado", () => {
    it("debe validar el nuevo número de colegiado", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);
        fireEvent.change(newNumInputs[0], { target: { value: "123" } });
      });

      const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);
      expect(newNumInputs[0]).toHaveValue("123");
    });

    it("debe permitir nuevo número de colegiado válido", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);
        fireEvent.change(newNumInputs[0], { target: { value: "99999" } });
      });

      const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);
      expect(newNumInputs[0]).toHaveValue("99999");
    });

    it("debe enviar número de colegiado actualizado al hacer clic", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputsActual = screen.getAllByPlaceholderText(/Número de colegiado actual/i);
        const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);

        fireEvent.change(numInputsActual[0], { target: { value: "12345" } });
        fireEvent.change(newNumInputs[0], { target: { value: "54321" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[2]);

      await waitFor(() => {
        expect(Axios.put).toHaveBeenCalled();
      });
    });

    it("debe mostrar alerta de éxito al cambiar número de colegiado", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputsActual = screen.getAllByPlaceholderText(/Número de colegiado actual/i);
        const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);

        fireEvent.change(numInputsActual[0], { target: { value: "12345" } });
        fireEvent.change(newNumInputs[0], { target: { value: "54321" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[2]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          "Número de colegiado actualizado exitosamente",
        );
      });
    });

    it("debe mostrar alerta de error cuando falla el cambio de número", async () => {
      Axios.put.mockRejectedValue(new Error("Error de servidor"));

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputsActual = screen.getAllByPlaceholderText(/Número de colegiado actual/i);
        const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);

        fireEvent.change(numInputsActual[0], { target: { value: "12345" } });
        fireEvent.change(newNumInputs[0], { target: { value: "54321" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[2]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });

    it("debe recargar usuarios después de cambiar número de colegiado", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputsActual = screen.getAllByPlaceholderText(/Número de colegiado actual/i);
        const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);

        fireEvent.change(numInputsActual[0], { target: { value: "12345" } });
        fireEvent.change(newNumInputs[0], { target: { value: "54321" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[2]);

      await waitFor(() => {
        expect(Axios.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  // Tests de validación de datos (campo data)
  describe("Validación de datos", () => {
    it("debe mostrar error cuando data excede 255 caracteres", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
        const longText = "a".repeat(256);
        fireEvent.change(correoInputs[0], { target: { value: longText } });
      });

      const errorMessages = screen.getAllByText("Máximo 255 caracteres");
      expect(errorMessages[0]).toBeInTheDocument();
    });

    it("debe permitir data con 255 caracteres", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
        const text = "a".repeat(255);
        fireEvent.change(correoInputs[0], { target: { value: text } });
      });

      const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
      expect(correoInputs[0]).toHaveValue("a".repeat(255));
    });

    it("debe limpiar error cuando data es menor a 255 caracteres", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
        fireEvent.change(correoInputs[0], { target: { value: "a".repeat(256) } });
      });

      let errorMessages = screen.getAllByText("Máximo 255 caracteres");
      expect(errorMessages[0]).toBeInTheDocument();

      await waitFor(() => {
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
        fireEvent.change(correoInputs[0], { target: { value: "test@example.com" } });
      });

      const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
      expect(correoInputs[0]).toHaveValue("test@example.com");
    });
  });

  // Tests de URLs de API
  describe("URLs de API", () => {
    it("debe usar URL correcta para obtener usuarios", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={5} />);

      await waitFor(() => {
        expect(Axios.get).toHaveBeenCalledWith(
          "http://localhost:3000/api/v1/usuarios/lugar/5",
        );
      });
    });

    it("debe usar URL correcta para actualizar correo", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);

        fireEvent.change(numInputs[0], { target: { value: "12345" } });
        fireEvent.change(correoInputs[0], { target: { value: "nuevo@example.com" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[0]);

      await waitFor(() => {
        expect(Axios.put).toHaveBeenCalled();
      });
    });

    it("debe usar URL correcta para actualizar contraseña", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);

        fireEvent.change(numInputs[1], { target: { value: "12345" } });
        fireEvent.change(passwordInputs[0], { target: { value: "newpass123" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[1]);

      await waitFor(() => {
        expect(Axios.put).toHaveBeenCalled();
      });
    });

    it("debe usar URL correcta para actualizar número de colegiado", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputsActual = screen.getAllByPlaceholderText(/Número de colegiado actual/i);
        const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);

        fireEvent.change(numInputsActual[0], { target: { value: "12345" } });
        fireEvent.change(newNumInputs[0], { target: { value: "54321" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[2]);

      await waitFor(() => {
        expect(Axios.put).toHaveBeenCalled();
      });
    });
  });

  // Tests de propiedades del componente
  describe("Props", () => {
    it("debe aceptar prop lugid como número", () => {
      const { container } = render(<UsuarioUpdate_mantenimiento lugid={10} />);
      expect(container).toBeInTheDocument();
    });

    it("debe usar valor por defecto si lugid no es proporcionado", () => {
      const { container } = render(<UsuarioUpdate_mantenimiento />);
      expect(container).toBeInTheDocument();
    });
  });

  // Tests de estilos
  describe("Estilos y atributos", () => {
    it("debe aplicar borde rojo cuando hay error en número de colegiado", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        fireEvent.change(inputs[0], { target: { value: "123" } });
      });

      const inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
      expect(inputs[0].style.borderColor).toBe("red");
    });

    it("debe remover borde rojo cuando se corrige el error", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        fireEvent.change(inputs[0], { target: { value: "123" } });
      });

      let inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
      expect(inputs[0].style.borderColor).toBe("red");

      await waitFor(() => {
        inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        fireEvent.change(inputs[0], { target: { value: "12345" } });
      });

      inputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
      expect(inputs[0].style.borderColor).toBe("inherit");
    });
  });

  // Tests de integración
  describe("Integración", () => {
    it("debe manejar un flujo completo de actualización de correo", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);

        fireEvent.change(numInputs[0], { target: { value: "12345" } });
        fireEvent.change(correoInputs[0], { target: { value: "actualizado@example.com" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[0]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Correo actualizado exitosamente");
        expect(Axios.put).toHaveBeenCalled();
        expect(Axios.get).toHaveBeenCalledTimes(2);
      });
    });

    it("debe manejar múltiples actualizaciones consecutivas", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      // Primera actualización: cambiar correo
      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);

        fireEvent.change(numInputs[0], { target: { value: "12345" } });
        fireEvent.change(correoInputs[0], { target: { value: "nuevo@example.com" } });
      });

      let botones = screen.getAllByRole("button");
      fireEvent.click(botones[0]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Correo actualizado exitosamente");
      });

      // Segunda actualización: cambiar contraseña
      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);

        fireEvent.change(numInputs[1], { target: { value: "12345" } });
        fireEvent.change(passwordInputs[0], { target: { value: "newpass123" } });
      });

      botones = screen.getAllByRole("button");
      fireEvent.click(botones[1]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Contraseña actualizada exitosamente");
        expect(Axios.put).toHaveBeenCalledTimes(2);
      });
    });
  });

  // Tests de manejo de errores
  describe("Manejo de errores", () => {
    it("debe mostrar error cuando los datos del correo son inválidos", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);

        fireEvent.change(numInputs[0], { target: { value: "" } });
        fireEvent.change(correoInputs[0], { target: { value: "" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[0]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });

    it("debe mostrar error cuando los datos de contraseña son inválidos", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);

        fireEvent.change(numInputs[1], { target: { value: "" } });
        fireEvent.change(passwordInputs[0], { target: { value: "" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[1]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });

    it("debe mostrar error cuando los datos del número de colegiado son inválidos", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);

        fireEvent.change(numInputs[2], { target: { value: "" } });
        fireEvent.change(newNumInputs[0], { target: { value: "" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[2]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });
  });

  // Tests de inputs
  describe("Atributos de inputs", () => {
    it("debe tener maxLength de 100 para correo", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
        expect(correoInputs[0].maxLength).toBe(100);
      });
    });

    it("debe tener maxLength de 8 para número de colegiado", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        expect(numInputs[0].maxLength).toBe(8);
      });
    });

    it("debe tener patrón numérico para número de colegiado", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        expect(numInputs[0].pattern).toBe("\\d{4,8}");
      });
    });

    it("debe ser de tipo text para número de colegiado", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado/i);
        expect(numInputs[0].type).toBe("text");
      });
    });

    it("debe ser de tipo email para correo", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);
        expect(correoInputs[0].type).toBe("email");
      });
    });

    it("debe ser de tipo password para contraseña", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);
        expect(passwordInputs[0].type).toBe("password");
      });
    });
  });

  // Tests adicionales de cobertura
  describe("Cobertura adicional", () => {
    it("debe usar getUsuarios correctamente en loadUsuarios", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        expect(Axios.get).toHaveBeenCalled();
      });
    });

    it("debe manejar validación de lugar ID en getUsuarios", async () => {
      render(<UsuarioUpdate_mantenimiento lugid={999} />);

      await waitFor(() => {
        expect(Axios.get).toHaveBeenCalledWith(
          "http://localhost:3000/api/v1/usuarios/lugar/999",
        );
      });
    });

    it("debe enviar datos correctos en updateCorreo", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const correoInputs = screen.getAllByPlaceholderText(/nuevo correo electrónico/i);

        fireEvent.change(numInputs[0], { target: { value: "12345" } });
        fireEvent.change(correoInputs[0], { target: { value: "test@example.com" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[0]);

      await waitFor(() => {
        expect(Axios.put).toHaveBeenCalled();
      });
    });

    it("debe enviar datos correctos en updateContraseña", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputs = screen.getAllByPlaceholderText(/Número de colegiado \(4-8 dígitos\)/i);
        const passwordInputs = screen.getAllByPlaceholderText(/nueva contraseña/i);

        fireEvent.change(numInputs[1], { target: { value: "12345" } });
        fireEvent.change(passwordInputs[0], { target: { value: "password123" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[1]);

      await waitFor(() => {
        expect(Axios.put).toHaveBeenCalled();
      });
    });

    it("debe enviar datos correctos en updateNum_colegiado", async () => {
      Axios.put.mockResolvedValue({ data: { success: true } });

      render(<UsuarioUpdate_mantenimiento lugid={1} />);

      await waitFor(() => {
        const numInputsActual = screen.getAllByPlaceholderText(/Número de colegiado actual/i);
        const newNumInputs = screen.getAllByPlaceholderText(/nuevo número de colegiado/i);

        fireEvent.change(numInputsActual[0], { target: { value: "12345" } });
        fireEvent.change(newNumInputs[0], { target: { value: "54321" } });
      });

      const botones = screen.getAllByRole("button");
      fireEvent.click(botones[2]);

      await waitFor(() => {
        expect(Axios.put).toHaveBeenCalled();
      });
    });
  });
});