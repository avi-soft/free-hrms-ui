import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeePersonalInfo from './EmployeePersonalInfo';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

jest.mock('../../../assets/Images/placeholder.jpg', () => ({
  default: 'test-file-stub',
}));

const mockStore = configureStore([]);
const store = mockStore({
  auth: { loading: false, AccessToken: 'test-token' },
  employee: { employees: ['test-employee-id'] },
  editing: { isEditing: false, preEditedEmployeeDetails: null },
  department: { departments: [] },
  theme: {
    darkMode: false, 
  },
  profile: { user: { firstName: 'John' } }
});

describe('EmployeePersonalInfo component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <EmployeePersonalInfo />
        </Provider>
      </BrowserRouter>
    );
  });

  it('renders input fields with correct placeholders', () => {
    expect(screen.getByPlaceholderText('Enter Your First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Your Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Your Mobile Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Your PAN Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Your Aadhar Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Your UAN Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter The Salary')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Employee Code')).toBeInTheDocument();
  });

  it('renders labels with correct inner text', () => {
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Join Date')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByText('PAN Number')).toBeInTheDocument();
    expect(screen.getByText('Aadhar Number')).toBeInTheDocument();
    expect(screen.getByText('UAN Number')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Employee Code')).toBeInTheDocument();
  });

  it('renders select options with correct inner text', () => {
    const departmentSelect = screen.getByTestId('department-select');
    expect(departmentSelect).toBeInTheDocument();
    
    const positionSelect = screen.getByTestId('position-select');
    expect(positionSelect).toBeInTheDocument();
    expect(positionSelect).toHaveTextContent('Developer');
    expect(positionSelect).toHaveTextContent('Tester');
    expect(positionSelect).toHaveTextContent('HR');

    const genderSelect = screen.getByTestId('gender-select');
    expect(genderSelect).toBeInTheDocument();
    expect(genderSelect).toHaveTextContent('MALE');
    expect(genderSelect).toHaveTextContent('FEMALE');
    expect(genderSelect).toHaveTextContent('Other');
  });

  it('renders submit button with correct inner text', () => {
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  it('renders next step button with correct inner text', () => {
    expect(screen.getByRole('button', { name: /Next Step/i })).toBeInTheDocument();
  });
});
