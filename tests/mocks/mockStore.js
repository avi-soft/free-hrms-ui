import configureStore from 'redux-mock-store';

const initialState = {
  auth: {
    AccessToken: 'your_mocked_access_token', // Replace with a test access token here
  },
  department: {
    departments: [],
    loading: false,
    AllDepartments: [],
  },
};

const mockStore = configureStore();

export default (state) => mockStore(state || initialState);
