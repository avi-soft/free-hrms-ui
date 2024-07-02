import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CreateUpdateDepartment from './createUpdateDepartment';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../../../../store/store';

// Mocking EmployeeSearch
jest.mock('../../../../../services/operations/employeeAPI', () => ({
  EmployeeSearch: jest.fn(() => Promise.resolve({ data: [{ userId: 1, firstName: 'John', lastName: 'Doe' }] })),
}));

// Mocking useDispatch and useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('CreateUpdateDepartment Component', () => {
  it('renders the input fields, placeholders, inner texts, and labels correctly', async () => {
    const mockDispatch = jest.fn();
    const mockAccessToken = 'mockAccessToken';
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue({ AccessToken: mockAccessToken });

    renderWithContext(<CreateUpdateDepartment />);

    // Check for Department Name input and label
    expect(screen.getByLabelText('Department Name*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search employee for adding as manager..')).toBeInTheDocument();

    // Check for Department Description input and label
    expect(screen.getByLabelText('Department Description*')).toBeInTheDocument();

    // Check for Employee Search input and label
    expect(screen.getByLabelText('Add Manager*')).toBeInTheDocument();

    // Search for manager
    await act(async () => {
      fireEvent.change(screen.getByTestId('employeeSearch'), { target: { value: 'John Doe' } });
    });

    // Add your assertions for the search results here
  });
});

function renderWithContext(element) {
  render(
    <BrowserRouter>
      <Provider store={store}>{element}</Provider>
    </BrowserRouter>
  );
}
