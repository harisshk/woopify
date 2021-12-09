import {combineReducers} from 'redux';

import products from './products';
import user from './user';
import categories from './categories';
import customer from './customer'
import cart from './cart';

const rootReducer = combineReducers({products, user, categories, customer, cart});
export default rootReducer;
