const initialState = {};

const customer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CUSTOMER':
            const { customer } = action.payload;
            return { ...customer };
        default:
            return state;
    }
};

export default customer;
