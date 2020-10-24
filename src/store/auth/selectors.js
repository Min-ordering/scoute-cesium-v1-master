export const initialState = {
  isAuthenticated: false,
};

export const isAuthenticated = (state = initialState) => (
  state.isAuthenticated || initialState.isAuthenticated
);