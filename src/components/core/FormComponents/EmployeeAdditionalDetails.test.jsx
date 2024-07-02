import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import EmployeeAdditionalDetails from './EmployeeAdditionalDetails';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('react-hook-form', () => ({
  useForm: jest.fn()
}));

jest.mock('../../../services/operations/employeeAPI', () => ({
  addEmployeeAddressDetails: jest.fn(),
  addEmployeeBankDetails: jest.fn(),
  addEmployeeEmergencyContactDetails: jest.fn(),
  EditEmployeeBankDetails: jest.fn(),
  EditEmployeeEmergencyContactDetails: jest.fn(),
  UpdateEmployeeAddressDetails: jest.fn()
}));

describe('EmployeeAdditionalDetails Component', () => {
  let mockDispatch;
  let mockRegister;
  let mockHandleSubmit;
  let mockSetValue;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockRegister = jest.fn();
    mockHandleSubmit = jest.fn((fn) => (event) => {
      event.preventDefault();
      fn();
    });
    mockSetValue = jest.fn();

    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      return selector({
        auth: { AccessToken: 'mockAccessToken', loading: false },
        employee: { employees: ['mockEmployeeId'] },
        editing: { isEditing: false, preEditedEmployeeDetails: null }
      });
    });

    useForm.mockImplementation(() => ({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      setValue: mockSetValue,
      formState: { errors: {} }
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Emergency Contact Form Tests
  test('renders Emergency Contact form correctly', () => {
    render(<EmployeeAdditionalDetails />);

    const contactInput = screen.getByTestId('contact-input');
    const relationshipInput = screen.getByTestId('relationship-input');
    const addButton = screen.getByTestId('add-contact-button');

    expect(contactInput).toBeInTheDocument();
    expect(contactInput).toHaveAttribute('placeholder', 'Enter Contact Number');
    expect(relationshipInput).toBeInTheDocument();
    expect(relationshipInput).toHaveAttribute('placeholder', 'Enter Relationship Detail..');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent('Add Contact');
  });

  test('submits Emergency Contact form correctly', () => {
    render(<EmployeeAdditionalDetails />);

    const contactInput = screen.getByTestId('contact-input');
    const relationshipInput = screen.getByTestId('relationship-input');
    const addButton = screen.getByTestId('add-contact-button');

    fireEvent.change(contactInput, { target: { value: '1234567890' } });
    fireEvent.change(relationshipInput, { target: { value: 'Brother' } });
    fireEvent.click(addButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  // Address Form Tests
  test('renders Address form correctly', () => {
    render(<EmployeeAdditionalDetails />);

    const addressTypeInput = screen.getByTestId('addressType-input');
    const propertyNumberInput = screen.getByTestId('propertyNumber-input');
    const cityInput = screen.getByTestId('city-input');
    const zipCodeInput = screen.getByTestId('zipCode-input');
    const stateInput = screen.getByTestId('state-input');
    const countryInput = screen.getByTestId('country-input');
    const addAddressButton = screen.getByTestId('add-address-button');

    expect(addressTypeInput).toBeInTheDocument();
    expect(propertyNumberInput).toBeInTheDocument();
    expect(propertyNumberInput).toHaveAttribute('placeholder', 'Enter Property Number');
    expect(cityInput).toBeInTheDocument();
    expect(cityInput).toHaveAttribute('placeholder', 'Enter City');
    expect(zipCodeInput).toBeInTheDocument();
    expect(zipCodeInput).toHaveAttribute('placeholder', 'Enter Zip Code');
    expect(stateInput).toBeInTheDocument();
    expect(stateInput).toHaveAttribute('placeholder', 'Enter State');
    expect(countryInput).toBeInTheDocument();
    expect(countryInput).toHaveAttribute('placeholder', 'Enter Country');
    expect(addAddressButton).toBeInTheDocument();
    expect(addAddressButton).toHaveTextContent('Add Address');
  });

  test('submits Address form correctly', () => {
    render(<EmployeeAdditionalDetails />);

    const addressTypeInput = screen.getByTestId('addressType-input');
    const propertyNumberInput = screen.getByTestId('propertyNumber-input');
    const cityInput = screen.getByTestId('city-input');
    const zipCodeInput = screen.getByTestId('zipCode-input');
    const stateInput = screen.getByTestId('state-input');
    const countryInput = screen.getByTestId('country-input');
    const addAddressButton = screen.getByTestId('add-address-button');

    fireEvent.change(addressTypeInput, { target: { value: 'Home' } });
    fireEvent.change(propertyNumberInput, { target: { value: '123' } });
    fireEvent.change(cityInput, { target: { value: 'Sample City' } });
    fireEvent.change(zipCodeInput, { target: { value: '12345' } });
    fireEvent.change(stateInput, { target: { value: 'Sample State' } });
    fireEvent.change(countryInput, { target: { value: 'Sample Country' } });
    fireEvent.click(addAddressButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  // Bank Details Form Tests
  test('renders Bank Details form correctly', () => {
    render(<EmployeeAdditionalDetails />);

    const bankNameInput = screen.getByLabelText('Bank Name*');
    const accountNumberInput = screen.getByLabelText('Account Number*');
    const ifscInput = screen.getByLabelText('IFSC Code*');
    const branchInput = screen.getByLabelText('Bank Branch*');
    const addBankButton = screen.getByText('Add');

    expect(bankNameInput).toBeInTheDocument();
    expect(accountNumberInput).toBeInTheDocument();
    expect(accountNumberInput).toHaveAttribute('placeholder', 'Enter Account Number');
    expect(ifscInput).toBeInTheDocument();
    expect(ifscInput).toHaveAttribute('placeholder', 'Enter IFSC Code');
    expect(branchInput).toBeInTheDocument();
    expect(branchInput).toHaveAttribute('placeholder', 'Enter Branch');
    expect(addBankButton).toBeInTheDocument();
  });

  test('submits Bank Details form correctly', () => {
    render(<EmployeeAdditionalDetails />);

    const bankNameInput = screen.getByLabelText('Bank Name*');
    const accountNumberInput = screen.getByLabelText('Account Number*');
    const ifscInput = screen.getByLabelText('IFSC Code*');
    const branchInput = screen.getByLabelText('Bank Branch*');
    const addBankButton = screen.getByText('Add');

    fireEvent.change(bankNameInput, { target: { value: 'Sample Bank' } });
    fireEvent.change(accountNumberInput, { target: { value: '1234567890' } });
    fireEvent.change(ifscInput, { target: { value: 'SBIN0001234' } });
    fireEvent.change(branchInput, { target: { value: 'Sample Branch' } });
    fireEvent.click(addBankButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  // Testing all fields for Address form
  test('submits Address form with all fields correctly', () => {
    render(<EmployeeAdditionalDetails />);

    const addressTypeInput = screen.getByTestId('addressType-input');
    const propertyNumberInput = screen.getByTestId('propertyNumber-input');
    const cityInput = screen.getByTestId('city-input');
    const zipCodeInput = screen.getByTestId('zipCode-input');
    const stateInput = screen.getByTestId('state-input');
    const countryInput = screen.getByTestId('country-input');
    const addAddressButton = screen.getByTestId('add-address-button');

    fireEvent.change(addressTypeInput, { target: { value: 'Home' } });
    fireEvent.change(propertyNumberInput, { target: { value: '123' } });
    fireEvent.change(cityInput, { target: { value: 'Sample City' } });
    fireEvent.change(zipCodeInput, { target: { value: '12345' } });
    fireEvent.change(stateInput, { target: { value: 'Sample State' } });
    fireEvent.change(countryInput, { target: { value: 'Sample Country' } });
    fireEvent.click(addAddressButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test('updates form fields when editing and pre-edited data is available', () => {
    const preEditedEmployeeDetails = {
      emergencyContacts: [
        { emergencyContactId: '1', contact: '1234567890', relationship: 'Brother' },
        { emergencyContactId: '2', contact: '0987654321', relationship: 'Sister' }
      ],
      addresses: [
        { addressId: '1', addressType: 'Home', propertyNumber: '123', zipCode: { city: 'Sample City', zipCode: '12345', state: 'Sample State' }, country: 'Sample Country' },
        { addressId: '2', addressType: 'Work', propertyNumber: '456', zipCode: { city: 'Another City', zipCode: '54321', state: 'Another State' }, country: 'Another Country' }
      ],
      account: {
        bankName: 'Sample Bank',
        accountNumber: '1234567890',
        ifsc: 'SBIN0001234',
        branch: 'Sample Branch'
      }
    };

    useSelector.mockImplementation((selector) => {
      return selector({
        auth: { AccessToken: 'mockAccessToken', loading: false },
        employee: { employees: ['mockEmployeeId'] },
        editing: { isEditing: true, preEditedEmployeeDetails: preEditedEmployeeDetails }
      });
    });

    render(<EmployeeAdditionalDetails />);

    // Check if the form fields are updated correctly
    expect(mockSetValue).toHaveBeenCalledTimes(24); // Double the number of fields (12 fields, each set twice)
    expect(mockSetValue).toHaveBeenCalledWith('contacts[0].contactId', '1');
    expect(mockSetValue).toHaveBeenCalledWith('contacts[0].contact', '1234567890');
    expect(mockSetValue).toHaveBeenCalledWith('contacts[0].relationship', 'Brother');
    expect(mockSetValue).toHaveBeenCalledWith('contacts[1].contactId', '2');
    expect(mockSetValue).toHaveBeenCalledWith('contacts[1].contact', '0987654321');
    expect(mockSetValue).toHaveBeenCalledWith('contacts[1].relationship', 'Sister');
    expect(mockSetValue).toHaveBeenCalledWith('addresses[0].addressId', '1');
    expect(mockSetValue).toHaveBeenCalledWith('addresses[0].addressType', 'Home');
    expect(mockSetValue).toHaveBeenCalledWith('addresses[0].propertyNumber', '123');
    expect(mockSetValue).toHaveBeenCalledWith('addresses[0].city', 'Sample City');
    expect(mockSetValue).toHaveBeenCalledWith('addresses[0].zipCode', '12345');
    expect(mockSetValue).toHaveBeenCalledWith('addresses[0].state', 'Sample State');
    expect(mockSetValue).toHaveBeenCalledWith('addresses[0].country', 'Sample Country');
    expect(mockSetValue).toHaveBeenCalledWith('bankName', 'Sample Bank');
    expect(mockSetValue).toHaveBeenCalledWith('accountNumber', '1234567890');
    expect(mockSetValue).toHaveBeenCalledWith('ifsc', 'SBIN0001234');
    expect(mockSetValue).toHaveBeenCalledWith('branch', 'Sample Branch');
  });

});

