import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import LogBtn from './LogBtn';

const mockStore = configureMockStore([]);

describe('LogBtn component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      theme: {
        darkMode: false
      }
    });
  });

  test('renders LogBtn component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LogBtn link="/some-link" text="Log In" />
        </MemoryRouter>
      </Provider>
    );

    const logBtn = screen.getByRole('button', { name: /Log In/i });
    expect(logBtn).toBeInTheDocument();
  });

  test('renders LogBtn component with dark mode', () => {
    store = mockStore({
      theme: {
        darkMode: true
      }
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LogBtn link="/some-link" text="Log In" />
        </MemoryRouter>
      </Provider>
    );

    const logBtn = screen.getByRole('button', { name: /Log In/i });
    expect(logBtn).toHaveClass('bg-gray-700');
  });

  // Add more tests as needed
});
