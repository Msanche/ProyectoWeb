import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect } from 'vitest'
import Login from './Login';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa BrowserRouter para envolver el componente Login


it('render sin fallos', () => {
  render(
    <Router> 
      <Login />
    </Router>
  );
  const iniciarSesionElements = screen.getAllByText('Iniciar Sesión');
  expect(iniciarSesionElements.length).toBeGreaterThan(0); // Verifica que al menos un elemento esté presente
  expect(screen.getByPlaceholderText('Correo')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
  expect(screen.getByText('Registrar')).toBeInTheDocument();
});


it('Actualización del estado al introducir datos', () => {
  render(
    <Router>
      <Login />
    </Router>
  );
  fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'test@test.com' } });
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } });
  expect(screen.getByPlaceholderText('Correo')).toHaveValue('test@test.com');
  expect(screen.getByPlaceholderText('Contraseña')).toHaveValue('password123');
});



