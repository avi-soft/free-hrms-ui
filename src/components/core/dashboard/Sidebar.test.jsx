import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Sidebar from './Sidebar';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../../store/store';

jest.mock('../../../constants/menu', () => ({
  __esModule: true,
  default: jest.fn(() => [
    { key: '1', label: 'Dashboard', path: '/' },
    { key: '2', label: 'Department', path: '/about' },
    { key: '3', label: 'Employee', path: '/contact' }
  ]),
}));

describe('Sidebar component', () => {
  test('renders correctly with menu items', async () => {
    renderWithContext(<Sidebar />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Employee')).toBeInTheDocument();
    });
  });
});

function renderWithContext(element) {
  render(
    <BrowserRouter>
      <Provider store={store}>
        {element}
      </Provider>
    </BrowserRouter>
  );
}
