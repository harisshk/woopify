const initialState = [];

const categories = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      const {categories} = action.payload;
      return [...categories];
    default:
      return state;
  }
};

export default categories;
