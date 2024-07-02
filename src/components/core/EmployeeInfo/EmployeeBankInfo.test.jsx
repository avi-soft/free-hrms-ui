import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeeBankInfo from './EmployeeBankInfo';
import { store } from '../../../store/store';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Mocking the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mocking the useSelector hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Helper function to render with context
function renderWithContext(element) {
  render(
    <BrowserRouter>
      <Provider store={store}>{element}</Provider>
    </BrowserRouter>
  );
}

test('renders bank account details correctly', () => {
  const mockNavigate = jest.fn();
  useNavigate.mockImplementation(() => mockNavigate);
  useSelector.mockImplementation((selector) =>
    selector({ auth: { loading: false } })
  );

  const user = {
    account: {
      bankName: 'Test Bank',
      accountNumber: '1234567890',
      ifsc: 'ABCD1234567',
      branch: 'Test Branch',
    },
  };

  renderWithContext(<EmployeeBankInfo user={user} />);

  // Assertions
  expect(screen.getByText('Bank Account Details')).toBeInTheDocument();
  expect(screen.getByText('Bank Name')).toBeInTheDocument();
  expect(screen.getByText('Test Bank')).toBeInTheDocument();
  expect(screen.getByText('Account Number')).toBeInTheDocument();
  expect(screen.getByText('1234567890')).toBeInTheDocument();
  expect(screen.getByText('IFSC Code')).toBeInTheDocument();
  expect(screen.getByText('ABCD1234567')).toBeInTheDocument();
  expect(screen.getByText('Branch')).toBeInTheDocument();
  expect(screen.getByText('Test Branch')).toBeInTheDocument();
});

test('renders with no bank account details', () => {
  const mockNavigate = jest.fn();
  useNavigate.mockImplementation(() => mockNavigate);
  useSelector.mockImplementation((selector) =>
    selector({ auth: { loading: false } })
  );

  const user = {
    account: {},
  };

  renderWithContext(<EmployeeBankInfo user={user} />);

  // Assertions for empty bank account details
  expect(screen.getByText('Bank Account Details')).toBeInTheDocument();
  expect(screen.getByText('Bank Name')).toBeInTheDocument();
  expect(screen.getByText('Account Number')).toBeInTheDocument();
  expect(screen.getByText('IFSC Code')).toBeInTheDocument();
  expect(screen.getByText('Branch')).toBeInTheDocument();
  // Checking that values are not present
  expect(screen.queryByText('Test Bank')).not.toBeInTheDocument();
  expect(screen.queryByText('1234567890')).not.toBeInTheDocument();
  expect(screen.queryByText('ABCD1234567')).not.toBeInTheDocument();
  expect(screen.queryByText('Test Branch')).not.toBeInTheDocument();
});
