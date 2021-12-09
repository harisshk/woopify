const SET_CART = 'SET_CART';

export const setCart = input => {
    return {
        type: SET_CART,
        payload: input,
    };
};
