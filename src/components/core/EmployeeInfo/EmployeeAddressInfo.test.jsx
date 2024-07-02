import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeeAddressInfo from './EmployeeAddressInfo';
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

test('renders address details correctly', () => {
  const mockNavigate = jest.fn();
  useNavigate.mockImplementation(() => mockNavigate);
  useSelector.mockImplementation((selector) =>
    selector({ auth: { loading: false } })
  );

  const user = {
    addresses: [
      {
        addressType: 'Home',
        country: 'India',
        propertyNumber: '123',
        zipCode: { city: 'Bangalore', state: 'Karnataka', zipCode: '560001' },
      },
    ],
  };

  renderWithContext(<EmployeeAddressInfo user={user} />);

  // Assertions
  expect(screen.getByText('Address Details')).toBeInTheDocument();
  expect(screen.getByText('Address Type')).toBeInTheDocument();
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Country')).toBeInTheDocument();
  expect(screen.getByText('India')).toBeInTheDocument();
  expect(screen.getByText('Property Number')).toBeInTheDocument();
  expect(screen.getByText('123')).toBeInTheDocument();
  expect(screen.getByText('City')).toBeInTheDocument();
  expect(screen.getByText('Bangalore')).toBeInTheDocument();
  expect(screen.getByText('State')).toBeInTheDocument();
  expect(screen.getByText('Karnataka')).toBeInTheDocument();
  expect(screen.getByText('Zip Code')).toBeInTheDocument();
  expect(screen.getByText('560001')).toBeInTheDocument();
});

test('renders with no address', () => {
  const mockNavigate = jest.fn();
  useNavigate.mockImplementation(() => mockNavigate);
  useSelector.mockImplementation((selector) =>
    selector({ auth: { loading: false } })
  );

  const user = {
    addresses: [],
  };

  renderWithContext(<EmployeeAddressInfo user={user} />);

  // Assertions for empty address details
  expect(screen.getByText('Address Details')).toBeInTheDocument();
  expect(screen.getByText('Address Type')).toBeInTheDocument();
  expect(screen.getByText('Country')).toBeInTheDocument();
  expect(screen.getByText('Property Number')).toBeInTheDocument();
  expect(screen.getByText('City')).toBeInTheDocument();
  expect(screen.getByText('State')).toBeInTheDocument();
  expect(screen.getByText('Zip Code')).toBeInTheDocument();
  // Checking that values are not present
  expect(screen.queryByText('Home')).not.toBeInTheDocument();
  expect(screen.queryByText('India')).not.toBeInTheDocument();
  expect(screen.queryByText('123')).not.toBeInTheDocument();
  expect(screen.queryByText('Bangalore')).not.toBeInTheDocument();
  expect(screen.queryByText('Karnataka')).not.toBeInTheDocument();
  expect(screen.queryByText('560001')).not.toBeInTheDocument();
});
