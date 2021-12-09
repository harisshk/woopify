const SET_PRODUCTS = 'SET_PRODUCTS';

export const setProducts = input => {
  return {
    type: SET_PRODUCTS,
    payload: input,
  };
};
