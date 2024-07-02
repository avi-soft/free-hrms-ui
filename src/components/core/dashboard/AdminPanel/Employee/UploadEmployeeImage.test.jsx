jest.mock('../../../../../assets/Images/placeholder.jpg', () => ({
  default: '../../../../../assets/Images/placeholder.jpg',
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UploadEmployeeImage from './UploadEmployeeImage';

const mockStore = configureStore([]);
const store = mockStore({
  profile: { user: { firstName: 'John' } },
  auth: { AccessToken: 'test-token' },
  employee: { employees: ['test-employee-id'] },
  editing: { isEditing: false, preEditedEmployeeDetails: null },
  theme: {
    darkMode: false, 
  },

});

describe('UploadEmployeeImage component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <UploadEmployeeImage />
        </Provider>
      </BrowserRouter>
    );
  });

  it('renders with correct text when not editing', () => {
    expect(screen.getByText('Upload Employee Profile Picture')).toBeInTheDocument();
  });

  it('renders with correct text when editing', () => {
    const editStore = mockStore({
      profile: { user: { firstName: 'John' } },
      auth: { AccessToken: 'test-token' },
      employee: { employees: ['test-employee-id'] },
      editing: { isEditing: true, preEditedEmployeeDetails: { profileImage: 'test-image.jpg' } },
    });

    render(
      <BrowserRouter>
        <Provider store={editStore}>
          <UploadEmployeeImage />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Update Employee Profile Picture')).toBeInTheDocument();
  });

  it('renders select button', () => {
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('renders upload button when not loading', () => {
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('renders update button when editing and not loading', () => {
    const editStore = mockStore({
      profile: { user: { firstName: 'John' } },
      auth: { AccessToken: 'test-token' },
      employee: { employees: ['test-employee-id'] },
      editing: { isEditing: true, preEditedEmployeeDetails: { profileImage: 'test-image.jpg' } },
    });

    render(
      <BrowserRouter>
        <Provider store={editStore}>
          <UploadEmployeeImage />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Update')).toBeInTheDocument();
  });
});
