import {combineReducers} from 'redux';
import dataReducers from './reducers';

const rootReducer = combineReducers({
    data:dataReducers,
    //altri reducer...
});

export default rootReducer;