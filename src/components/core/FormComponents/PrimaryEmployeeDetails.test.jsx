import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PrimaryEmployeeDetails from './PrimaryEmployeeDetails';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';



describe('PrimaryEmployeeDetails component', () => {
  it('renders form fields with correct placeholders', () => {
    renderWithContext(<PrimaryEmployeeDetails />);

    expect(screen.getByPlaceholderText('Enter Your Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Your Password')).toBeInTheDocument();
  });

  it('renders form field labels with correct inner text', () => {
    renderWithContext(<PrimaryEmployeeDetails />);

    expect(screen.getByLabelText('Email Address*')).toBeInTheDocument();
    expect(screen.getByLabelText('Password*')).toBeInTheDocument();
    expect(screen.getByLabelText('Role*')).toBeInTheDocument();
  });

  it('renders submit button with correct inner text', () => {
    renderWithContext(<PrimaryEmployeeDetails />);

    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    renderWithContext(<PrimaryEmployeeDetails />);

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('role-select')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });
});

function renderWithContext(element) {
  render(
    <BrowserRouter>
      <Provider store={store}>{element}</Provider>
    </BrowserRouter>
  );
}
