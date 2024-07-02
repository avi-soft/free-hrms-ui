import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import { Provider } from 'react-redux';
import NavBar from './NavBar';
import { createStore } from 'redux';
import rootReducer from '../../reducer';

// Mock useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(), 
}));

const renderWithContext = (element, store) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>{element}</Provider>
    </MemoryRouter>
  );
};

describe('NavBar component', () => {
  test('renders logo', () => {
    const store = createStore(rootReducer, { auth: { AccessToken: null } });
    renderWithContext(<NavBar />, store);
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders search input and button', () => {
    const store = createStore(rootReducer, { auth: { AccessToken: null } });
    renderWithContext(<NavBar />, store);
    const searchInput = screen.getByPlaceholderText('Search Employee..');
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('renders Log In button when user is not authenticated', () => {
    const store = createStore(rootReducer, { auth: { AccessToken: null } });
    renderWithContext(<NavBar />, store);
    const logInButton = screen.getByRole('link', { name: /log in/i });
    expect(logInButton).toBeInTheDocument();
  });

  test('renders ProfileDropDown when user is authenticated', () => {
    const authenticatedStore = createStore(rootReducer, { auth: { AccessToken: 'test-token' } });
    renderWithContext(<NavBar />, authenticatedStore);
    const profileDropDown = screen.getByTestId('profile-dropdown');
    expect(profileDropDown).toBeInTheDocument();
  });
});
