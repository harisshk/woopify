const SET_CUSTOMER = 'SET_CUSTOMER';

export const setCustomer = input => {
  return {
    type: SET_CUSTOMER,
    payload: input,
  };
};
