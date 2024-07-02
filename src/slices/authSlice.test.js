import authReducer, { setToken, setLoading } from './authSlice';

describe('authReducer', () => {
  const initialState = {
    AccessToken: null,
    loading: false,
  };

  it('should handle setToken action', () => {
    const action = setToken('someToken');
    const state = authReducer(initialState, action);
    expect(state.AccessToken).toEqual('someToken');
  });

  it('should handle setLoading action', () => {
    const action = setLoading(true);
    const state = authReducer(initialState, action);
    expect(state.loading).toEqual(true);
  });
});
