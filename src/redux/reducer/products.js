const initialState = [];

const products = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      const {products} = action.payload;
      return[
        ...products
      ]
    default:
      return state;
  }
};

export default products;
