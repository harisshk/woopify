const SET_CATEGORIES = 'SET_CATEGORIES';

export const setCategories = input => {
  return {
    type: SET_CATEGORIES,
    payload: input,
  };
};
