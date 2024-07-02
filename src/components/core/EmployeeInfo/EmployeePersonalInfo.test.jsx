import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for custom jest matchers like .toBeInTheDocument
import EmployeePersonalInfo from './EmployeePersonalInfo';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';

test('renders personal details correctly', () => {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    contact: '1234567890',
    gender: 'Male',
  };

  renderWithContext(<EmployeePersonalInfo user={user} />);

  expect(screen.getByText('Personal Details')).toBeInTheDocument();
  expect(screen.getByText('First Name')).toBeInTheDocument();
  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByText('Last Name')).toBeInTheDocument();
  expect(screen.getByText('Doe')).toBeInTheDocument();
  expect(screen.getByText('Email')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
  expect(screen.getByText('Contact Number')).toBeInTheDocument();
  expect(screen.getByText('1234567890')).toBeInTheDocument();
  expect(screen.getByText('Gender')).toBeInTheDocument();
  expect(screen.getByText('Male')).toBeInTheDocument();
});

test('renders edit button', () => {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    contact: '1234567890',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
  };

  renderWithContext(<EmployeePersonalInfo user={user} />);

});
function renderWithContext(element) {
    render(
      <BrowserRouter>
      <Provider store={store}>{element}</Provider>
      </BrowserRouter>
    );
  }