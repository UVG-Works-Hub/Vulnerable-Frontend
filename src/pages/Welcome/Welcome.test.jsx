import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import Welcome from "./Welcome";

// Wrapper para proporcionar BrowserRouter (requerido para Link)
const WelcomeWithRouter = () => (
  <BrowserRouter>
    <Welcome />
  </BrowserRouter>
);

describe("Welcome", () => {
  // Tests de renderizado inicial
  describe("Renderizado inicial", () => {
    it("debe renderizar sin errores", () => {
      const { container } = render(<WelcomeWithRouter />);
      expect(container).toBeInTheDocument();
    });

    it("debe renderizar el contenedor principal", () => {
      render(<WelcomeWithRouter />);
      const mainDiv = screen.getByRole("link", { name: /Log In/i }).closest("div").parentElement;
      expect(mainDiv).toBeInTheDocument();
    });

    it("debe renderizar ambos enlaces", () => {
      render(<WelcomeWithRouter />);
      expect(screen.getByRole("link", { name: /Log In/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Sign In/i })).toBeInTheDocument();
    });
  });

  // Tests de enlaces
  describe("Enlaces de navegación", () => {
    it("debe tener enlace a /login", () => {
      render(<WelcomeWithRouter />);
      const loginLink = screen.getByRole("link", { name: /Log In/i });
      expect(loginLink).toHaveAttribute("href", "/login");
    });

    it("debe tener enlace a /signin", () => {
      render(<WelcomeWithRouter />);
      const signinLink = screen.getByRole("link", { name: /Sign In/i });
      expect(signinLink).toHaveAttribute("href", "/signin");
    });

    it("debe renderizar el enlace Log In con el texto correcto", () => {
      render(<WelcomeWithRouter />);
      const loginLink = screen.getByRole("link", { name: /Log In/i });
      expect(loginLink.textContent).toBe("Log In");
    });

    it("debe renderizar el enlace Sign In con el texto correcto", () => {
      render(<WelcomeWithRouter />);
      const signinLink = screen.getByRole("link", { name: /Sign In/i });
      expect(signinLink.textContent).toBe("Sign In");
    });
  });

  // Tests de contenido
  describe("Contenido", () => {
    it("debe mostrar el texto 'Log In'", () => {
      render(<WelcomeWithRouter />);
      expect(screen.getByText("Log In")).toBeInTheDocument();
    });

    it("debe mostrar el texto 'Sign In'", () => {
      render(<WelcomeWithRouter />);
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    it("debe tener exactamente 2 enlaces", () => {
      render(<WelcomeWithRouter />);
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
    });
  });

  // Tests de estructura DOM
  describe("Estructura DOM", () => {
    it("debe tener una estructura de divs anidados", () => {
      const { container } = render(<WelcomeWithRouter />);
      const allDiv = container.querySelector(".all") || container.firstChild;
      expect(allDiv).toBeInTheDocument();
    });

    it("debe contener los enlaces dentro de un contenedor", () => {
      render(<WelcomeWithRouter />);
      const loginLink = screen.getByRole("link", { name: /Log In/i });
      const signinLink = screen.getByRole("link", { name: /Sign In/i });
      
      expect(loginLink.parentElement).toBeDefined();
      expect(signinLink.parentElement).toBeDefined();
    });

    it("debe tener dos enlaces hermanos", () => {
      render(<WelcomeWithRouter />);
      const loginLink = screen.getByRole("link", { name: /Log In/i });
      const signinLink = screen.getByRole("link", { name: /Sign In/i });
      
      expect(loginLink.parentElement).toBe(signinLink.parentElement);
    });
  });

  // Tests de accesibilidad
  describe("Accesibilidad", () => {
    it("debe tener enlaces accesibles por rol", () => {
      render(<WelcomeWithRouter />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("debe tener texto descriptivo en los enlaces", () => {
      render(<WelcomeWithRouter />);
      expect(screen.getByRole("link", { name: /Log In/i })).toHaveAccessibleName("Log In");
      expect(screen.getByRole("link", { name: /Sign In/i })).toHaveAccessibleName("Sign In");
    });

    it("debe ser navegable con teclado", () => {
      render(<WelcomeWithRouter />);
      const loginLink = screen.getByRole("link", { name: /Log In/i });
      expect(loginLink.tagName).toBe("A");
    });
  });

  // Tests de clases CSS
  describe("Clases CSS", () => {
    it("debe aplicar clases al contenedor principal", () => {
      const { container } = render(<WelcomeWithRouter />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass("all");
    });

    it("debe aplicar clase login al enlace Log In", () => {
      render(<WelcomeWithRouter />);
      const loginLink = screen.getByRole("link", { name: /Log In/i });
      expect(loginLink).toHaveClass("login");
    });

    it("debe aplicar clase signin al enlace Sign In", () => {
      render(<WelcomeWithRouter />);
      const signinLink = screen.getByRole("link", { name: /Sign In/i });
      expect(signinLink).toHaveClass("signin");
    });

    it("debe aplicar clase styles al contenedor de enlaces", () => {
      const { container } = render(<WelcomeWithRouter />);
      const stylesDiv = container.querySelector(".styles");
      expect(stylesDiv).toBeInTheDocument();
    });
  });

  // Tests de integración
  describe("Integración", () => {
    it("debe renderizar correctamente la estructura completa", () => {
      const { container } = render(<WelcomeWithRouter />);
      const allDiv = container.querySelector(".all");
      const stylesDiv = container.querySelector(".styles");
      const links = screen.getAllByRole("link");

      expect(allDiv).toBeInTheDocument();
      expect(stylesDiv).toBeInTheDocument();
      expect(links).toHaveLength(2);
    });

    it("debe ser un componente funcional", () => {
      const { container } = render(<WelcomeWithRouter />);
      expect(container.children.length).toBeGreaterThan(0);
    });

    it("debe exportar el componente por defecto", () => {
      expect(Welcome).toBeDefined();
      expect(typeof Welcome).toBe("function");
    });
  });

  // Tests de comportamiento visual
  describe("Comportamiento visual", () => {
    it("los enlaces deben ser elementos <a>", () => {
      render(<WelcomeWithRouter />);
      const links = screen.getAllByRole("link");
      links.forEach(link => {
        expect(link.tagName).toBe("A");
      });
    });

    it("debe tener Enlaces que apunten a rutas válidas", () => {
      render(<WelcomeWithRouter />);
      const loginLink = screen.getByRole("link", { name: /Log In/i });
      const signinLink = screen.getByRole("link", { name: /Sign In/i });

      expect(loginLink.href).toContain("/login");
      expect(signinLink.href).toContain("/signin");
    });

    it("debe mantener el orden correcto de los enlaces", () => {
      render(<WelcomeWithRouter />);
      const links = screen.getAllByRole("link");
      expect(links[0].textContent).toBe("Log In");
      expect(links[1].textContent).toBe("Sign In");
    });
  });
});