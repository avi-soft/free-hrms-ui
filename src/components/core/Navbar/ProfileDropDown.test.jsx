
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ProfileDropDown from './ProfileDropDown';

const mockStore = configureStore([]);

describe('ProfileDropDown', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      profile: {
        user: {
          firstName: 'kirandeep',
          lastName: 'Singh',
          profileImage: 'https://api.dicebear.com/5.x/initials/svg?seed=kirandeep Singh',
          roles: [{ role: 'Admin' }],
        },
      },
      theme: {
        darkMode: false, 
      },
    });
  });

  it('renders correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          <ProfileDropDown />
        </Router>
      </Provider>
    );

    expect(screen.getByText('kirandeep')).toBeInTheDocument();
    expect(screen.getByText('Singh')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ProfileDropDown />
        </Router>
      </Provider>
    );

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('kirandeep'));

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  it('closes dropdown on outside click', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ProfileDropDown />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByText('kirandeep'));

    fireEvent.click(screen.getByText('kirandeep').parentElement.parentElement);
  });

  it('opens confirmation modal on logout click', async () => {
    render(
      <Provider store={store}>
        <Router>
          <ProfileDropDown />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByText('kirandeep'));

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByText('Are You Sure?')).toBeInTheDocument();
      expect(screen.getByText('You Will be Logged Out of Your Account')).toBeInTheDocument();
    });
  });
});
