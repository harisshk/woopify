const SET_USER = 'SET_USER';

export const setUser = input => {
  return {
    type: SET_USER,
    payload: input,
  };
};
