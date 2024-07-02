import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeeAdditionalInfo from './EmployeeAdditionalInfo';
import { store } from '../../../store/store';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

test('renders additional details correctly', () => {
  const user = {
    department: 'Engineering',
    position: 'Software Engineer',
    employeeCode: 'EMP123',
    roles: [{ role: 'Developer' }],
    joinDate: '2024-02-24',
    adhaarNumber: '5152280047099240',
    panNumber: 'ABCDE1234F',
    uanNumber: '5150',
    salary: 'Rs5000',
  };

  renderWithContext(<EmployeeAdditionalInfo user={user} />);

  expect(screen.getByText('Additional Details')).toBeInTheDocument();
  expect(screen.getByText('Department')).toBeInTheDocument();
  expect(screen.getByText('Engineering')).toBeInTheDocument();
  expect(screen.getByText('Position')).toBeInTheDocument();
  expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  expect(screen.getByText('Employee Code')).toBeInTheDocument();
  expect(screen.getByText('EMP123')).toBeInTheDocument();
  expect(screen.getByText('Role')).toBeInTheDocument();
  expect(screen.getByText('Developer')).toBeInTheDocument();
  expect(screen.getByText('Join Date')).toBeInTheDocument();
  expect(screen.getByText('February 24, 2024')).toBeInTheDocument();
  expect(screen.getByText('Aadhar Number')).toBeInTheDocument();
  expect(screen.getByText('5152280047099240')).toBeInTheDocument();
  expect(screen.getByText('PAN Number')).toBeInTheDocument();
  expect(screen.getByText('ABCDE1234F')).toBeInTheDocument();
  expect(screen.getByText('UAN Number')).toBeInTheDocument();
  expect(screen.getByText('5150')).toBeInTheDocument();
  expect(screen.getByText('Salary')).toBeInTheDocument();
  expect(screen.getByText('Rs5000')).toBeInTheDocument();
});

function renderWithContext(element) {
  render(
    <BrowserRouter>
    <Provider store={store}>{element}</Provider>
    </BrowserRouter>
  );
}
