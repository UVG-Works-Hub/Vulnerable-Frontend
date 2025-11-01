import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import UsuarioAdd_mantenimiento from "./UsuarioAdd_mantenimiento";
import Axios from "axios";

jest.mock("axios");

// Mock de las funciones de sanitización
jest.mock("../../utils/sanitizer", () => ({
  validateAndSanitize: jest.fn((value, options) => {
    // Simulación básica de validación
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
  isValidEmail: jest.fn((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  isValidNumeroColegiado: jest.fn((num) => /^\d{4,8}$/.test(num)),
}));

describe("UsuarioAdd_mantenimiento", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Tests de renderizado
  describe("Renderizado inicial", () => {
    it("debe renderizar todos los campos del formulario", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      expect(screen.getByText("Correo *")).toBeInTheDocument();
      expect(screen.getByText("Contraseña *")).toBeInTheDocument();
      expect(screen.getByText("Número de Colegiado *")).toBeInTheDocument();
      expect(screen.getByText("* Campos requeridos")).toBeInTheDocument();
    });

    it("debe renderizar los inputs con placeholders correctos", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      expect(screen.getByPlaceholderText("Escriba el correo electrónico")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)")).toBeInTheDocument();
    });

    it("debe renderizar el botón Agregar Usuario", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const button = screen.getByRole("button", { name: /Agregar Usuario/i });
      expect(button).toBeInTheDocument();
      expect(button.type).toBe("submit");
    });

    it("debe tener los inputs vacíos inicialmente", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");

      expect(correoInput.value).toBe("");
      expect(contraseñaInput.value).toBe("");
      expect(numColegiadoInput.value).toBe("");
    });
  });

  // Tests de validación de correo
  describe("Validación de correo", () => {
    it("debe mostrar error cuando el correo es inválido", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      fireEvent.change(correoInput, { target: { value: "correo_invalido" } });

      expect(screen.getByText("Email inválido")).toBeInTheDocument();
    });

    it("debe limpiar el error cuando el correo es válido", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      
      // Escribir correo inválido
      fireEvent.change(correoInput, { target: { value: "invalido" } });
      expect(screen.getByText("Email inválido")).toBeInTheDocument();

      // Escribir correo válido
      fireEvent.change(correoInput, { target: { value: "test@example.com" } });
      expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
    });

    it("debe limpiar el error cuando el correo está vacío", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      
      fireEvent.change(correoInput, { target: { value: "test@example.com" } });
      fireEvent.change(correoInput, { target: { value: "" } });

      expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
    });

    it("debe permitir emails válidos con diferentes dominios", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      
      fireEvent.change(correoInput, { target: { value: "usuario@dominio.com" } });
      expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();

      fireEvent.change(correoInput, { target: { value: "otro@hospital.org" } });
      expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
    });

    it("debe tener maxLength de 100 caracteres", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      expect(correoInput.maxLength).toBe(100);
    });
  });

  // Tests de validación de contraseña
  describe("Validación de contraseña", () => {
    it("debe mostrar error cuando la contraseña tiene menos de 6 caracteres", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      fireEvent.change(contraseñaInput, { target: { value: "12345" } });

      expect(screen.getByText("Mínimo 6 caracteres")).toBeInTheDocument();
    });

    it("debe limpiar el error cuando la contraseña tiene 6 o más caracteres", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      
      fireEvent.change(contraseñaInput, { target: { value: "12345" } });
      expect(screen.getByText("Mínimo 6 caracteres")).toBeInTheDocument();

      fireEvent.change(contraseñaInput, { target: { value: "123456" } });
      expect(screen.queryByText("Mínimo 6 caracteres")).not.toBeInTheDocument();
    });

    it("debe limpiar el error cuando la contraseña está vacía", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      
      fireEvent.change(contraseñaInput, { target: { value: "123456" } });
      fireEvent.change(contraseñaInput, { target: { value: "" } });

      expect(screen.queryByText("Mínimo 6 caracteres")).not.toBeInTheDocument();
    });

    it("debe permitir contraseñas seguras", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      
      fireEvent.change(contraseñaInput, { target: { value: "MiContraseña123!" } });
      expect(screen.queryByText("Mínimo 6 caracteres")).not.toBeInTheDocument();
    });

    it("debe tener maxLength de 100 caracteres", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      expect(contraseñaInput.maxLength).toBe(100);
    });

    it("debe ser de tipo password", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      expect(contraseñaInput.type).toBe("password");
    });
  });

  // Tests de validación de número de colegiado
  describe("Validación de número de colegiado", () => {
    it("debe mostrar error cuando el número de colegiado es inválido", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      fireEvent.change(numColegiadoInput, { target: { value: "123" } });

      expect(screen.getByText("Número de colegiado inválido (4-8 dígitos)")).toBeInTheDocument();
    });

    it("debe limpiar el error cuando el número de colegiado es válido", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      
      fireEvent.change(numColegiadoInput, { target: { value: "123" } });
      expect(screen.getByText("Número de colegiado inválido (4-8 dígitos)")).toBeInTheDocument();

      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      expect(screen.queryByText("Número de colegiado inválido (4-8 dígitos)")).not.toBeInTheDocument();
    });

    it("debe limpiar el error cuando el campo está vacío", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.change(numColegiadoInput, { target: { value: "" } });

      expect(screen.queryByText("Número de colegiado inválido (4-8 dígitos)")).not.toBeInTheDocument();
    });

    it("debe aceptar números de colegiado válidos de 4 a 8 dígitos", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      
      // 4 dígitos
      fireEvent.change(numColegiadoInput, { target: { value: "1234" } });
      expect(screen.queryByText("Número de colegiado inválido (4-8 dígitos)")).not.toBeInTheDocument();

      // 8 dígitos
      fireEvent.change(numColegiadoInput, { target: { value: "12345678" } });
      expect(screen.queryByText("Número de colegiado inválido (4-8 dígitos)")).not.toBeInTheDocument();
    });

    it("debe rechazar números con letras", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      fireEvent.change(numColegiadoInput, { target: { value: "abc1234" } });

      expect(screen.getByText("Número de colegiado inválido (4-8 dígitos)")).toBeInTheDocument();
    });

    it("debe tener maxLength de 8 caracteres", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      expect(numColegiadoInput.maxLength).toBe(8);
    });

    it("debe tener patrón numérico", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      expect(numColegiadoInput.pattern).toBe("\\d{4,8}");
    });
  });

  // Tests de envío de formulario
  describe("Envío de formulario", () => {
    it("debe enviar los datos correctos cuando el formulario es válido", async () => {
      Axios.post.mockResolvedValue({ data: { id: 1, success: true } });

      render(<UsuarioAdd_mantenimiento lugid={5} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "usuario@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "password123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(Axios.post).toHaveBeenCalledWith(
          "http://localhost:3000/api/v1/usuarios/",
          expect.objectContaining({
            correo: "usuario@example.com",
            contrasena: "password123",
            numero_colegiado: "12345",
            lugar_id: "5",
          }),
        );
      });
    });

    it("debe mostrar alerta de éxito cuando el usuario se agrega correctamente", async () => {
      Axios.post.mockResolvedValue({ data: { id: 1, success: true } });

      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "usuario@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "password123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Usuario agregado exitosamente");
      });
    });

    it("debe limpiar el formulario después del éxito", async () => {
      Axios.post.mockResolvedValue({ data: { id: 1, success: true } });

      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "usuario@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "password123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(correoInput.value).toBe("");
        expect(contraseñaInput.value).toBe("");
        expect(numColegiadoInput.value).toBe("");
      });
    });

    it("debe limpiar los errores después del envío exitoso", async () => {
      Axios.post.mockResolvedValue({ data: { id: 1, success: true } });

      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "usuario@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "password123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
        expect(screen.queryByText("Mínimo 6 caracteres")).not.toBeInTheDocument();
        expect(screen.queryByText("Número de colegiado inválido (4-8 dígitos)")).not.toBeInTheDocument();
      });
    });

    it("debe mostrar alerta de error cuando falla la validación de correo", async () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "" } });
      fireEvent.change(contraseñaInput, { target: { value: "password123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });

    it("debe mostrar alerta de error cuando falla la validación de contraseña", async () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "usuario@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "" } });
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });

    it("debe mostrar alerta de error cuando falla la validación del número de colegiado", async () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "usuario@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "password123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });

    it("debe mostrar alerta de error cuando la solicitud HTTP falla", async () => {
      Axios.post.mockRejectedValue(new Error("Error de servidor"));

      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "usuario@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "password123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining("Error:"));
      });
    });
  });

  // Tests de props
  describe("Props", () => {
    it("debe aceptar prop lugid como número", () => {
      const { container } = render(<UsuarioAdd_mantenimiento lugid={10} />);
      expect(container).toBeInTheDocument();
    });

    it("debe usar valor por defecto si lugid no es proporcionado", () => {
      const { container } = render(<UsuarioAdd_mantenimiento />);
      expect(container).toBeInTheDocument();
    });

    it("debe usar lugid en la solicitud POST", async () => {
      Axios.post.mockResolvedValue({ data: { id: 1 } });

      const { rerender } = render(<UsuarioAdd_mantenimiento lugid={99} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "usuario@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "password123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(Axios.post).toHaveBeenCalledWith(
          "http://localhost:3000/api/v1/usuarios/",
          expect.objectContaining({
            lugar_id: "99",
          }),
        );
      });
    });
  });

  // Tests de estilos y atributos
  describe("Estilos y atributos", () => {
    it("debe aplicar borde rojo cuando hay error en correo", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      fireEvent.change(correoInput, { target: { value: "invalido" } });

      expect(correoInput.style.borderColor).toBe("red");
    });

    it("debe aplicar borde rojo cuando hay error en contraseña", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      fireEvent.change(contraseñaInput, { target: { value: "12345" } });

      expect(contraseñaInput.style.borderColor).toBe("red");
    });

    it("debe aplicar borde rojo cuando hay error en número de colegiado", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      fireEvent.change(numColegiadoInput, { target: { value: "123" } });

      expect(numColegiadoInput.style.borderColor).toBe("red");
    });

    it("debe remover borde rojo cuando se corrige el error", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      fireEvent.change(correoInput, { target: { value: "invalido" } });
      expect(correoInput.style.borderColor).toBe("red");

      fireEvent.change(correoInput, { target: { value: "valido@example.com" } });
      expect(correoInput.style.borderColor).toBe("inherit");
    });
  });

  // Tests de integración
  describe("Integración", () => {
    it("debe manejar un flujo completo de agregar usuario", async () => {
      Axios.post.mockResolvedValue({ data: { id: 1, success: true } });

      render(<UsuarioAdd_mantenimiento lugid={1} />);

      // Llenar el formulario
      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      fireEvent.change(correoInput, { target: { value: "newuser@hospital.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "SecurePass123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "54321" } });

      // Verificar que no hay errores
      expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
      expect(screen.queryByText("Mínimo 6 caracteres")).not.toBeInTheDocument();
      expect(screen.queryByText("Número de colegiado inválido")).not.toBeInTheDocument();

      // Enviar formulario
      fireEvent.click(button);

      await waitFor(() => {
        expect(Axios.post).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith("Usuario agregado exitosamente");
        expect(correoInput.value).toBe("");
        expect(contraseñaInput.value).toBe("");
        expect(numColegiadoInput.value).toBe("");
      });
    });

    it("debe manejar múltiples intentos de envío", async () => {
      Axios.post.mockResolvedValue({ data: { id: 1, success: true } });

      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");
      const contraseñaInput = screen.getByPlaceholderText("Escriba la contraseña (mínimo 6 caracteres)");
      const numColegiadoInput = screen.getByPlaceholderText("Escriba el número de colegiado (4-8 dígitos)");
      const button = screen.getByRole("button", { name: /Agregar Usuario/i });

      // Primer intento
      fireEvent.change(correoInput, { target: { value: "usuario1@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "password123" } });
      fireEvent.change(numColegiadoInput, { target: { value: "12345" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("Usuario agregado exitosamente");
      });

      // Segundo intento
      fireEvent.change(correoInput, { target: { value: "usuario2@example.com" } });
      fireEvent.change(contraseñaInput, { target: { value: "password456" } });
      fireEvent.change(numColegiadoInput, { target: { value: "67890" } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(Axios.post).toHaveBeenCalledTimes(2);
      });
    });

    it("debe validar en tiempo real mientras se escribe", () => {
      render(<UsuarioAdd_mantenimiento lugid={1} />);

      const correoInput = screen.getByPlaceholderText("Escriba el correo electrónico");

      // Escribir carácter por carácter
      fireEvent.change(correoInput, { target: { value: "t" } });
      expect(screen.getByText("Email inválido")).toBeInTheDocument();

      fireEvent.change(correoInput, { target: { value: "te" } });
      expect(screen.getByText("Email inválido")).toBeInTheDocument();

      fireEvent.change(correoInput, { target: { value: "test@" } });
      expect(screen.getByText("Email inválido")).toBeInTheDocument();

      fireEvent.change(correoInput, { target: { value: "test@example.com" } });
      expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
    });
  });
});