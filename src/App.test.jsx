import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

// Leer la clave desde el entorno
const PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;

test('renders App component without crashing', () => {
  const { getByText } = render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
  expect(getByText(/Welcome to the App/i)).toBeInTheDocument();
});