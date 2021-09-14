import {combineReducers} from 'redux';

import products from './products';
import user from './user';
import categories from './categories';
import customer from './customer'

const rootReducer = combineReducers({products, user, categories, customer});
export default rootReducer;
