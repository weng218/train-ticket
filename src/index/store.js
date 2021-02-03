import {
	createStore,
	combineReducers,
	applyMiddleware
} from 'redux';

import reducers from './reducers';
import thunk from 'redux-thunk';

export default createStore(
	combineReducers(reducers),
	{
		from: 'beijing',
		to: 'shanghai',
		isCitySelectorVisible: false,
		currentSelectingLeftCity: false,
		cityData: null,
		isLoadingCityData: false,
		isDateSelectorVisible: false,
		departDate: Date.now(),
		highSpeed: false,
	},
	applyMiddleware(thunk)
);