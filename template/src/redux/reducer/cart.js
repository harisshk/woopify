const initialState = {};

const cart = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CART':
            const { cart } = action.payload;
            return {
                ...cart
            };
        default:
            return state;
    }
};

export default cart;
