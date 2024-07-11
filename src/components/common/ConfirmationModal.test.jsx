import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import ConfirmationModal from './ConfirmationModal';
import IconBtn from './IconBtn';

// Mock the IconBtn component
jest.mock('./IconBtn', () => ({ text, onclick }) => (
  <button onClick={onclick}>{text}</button>
));

// Mock Redux state
const initialState = {
  theme: { darkMode: true }
};

function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const store = createStore(reducer);

const renderWithProviders = (ui) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

test('renders ConfirmationModal component', () => {
  const modalData = {
    text1: 'Confirm Action',
    text2: 'Are you sure you want to proceed?',
    btn1Text: 'Yes',
    btn1Handler: jest.fn(),
    btn2Text: 'No',
    btn2Handler: jest.fn(),
  };

  renderWithProviders(<ConfirmationModal modalData={modalData} />);

  // Check if the modal texts are rendered
  expect(screen.getByText('Confirm Action')).toBeInTheDocument();
  expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  
  // Check if the buttons are rendered with correct texts
  expect(screen.getByText('Yes')).toBeInTheDocument();
  expect(screen.getByText('No')).toBeInTheDocument();
});
