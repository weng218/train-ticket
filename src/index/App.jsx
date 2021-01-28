import React, { 
	useCallback,
	useMemo 
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './App.css';

import Header from '../common/Header.jsx'
import DepartDate from './DepartDate.jsx'
import HighSpeed from './HighSpeed.jsx'
import Journey from './Journey.jsx'
import Submit from './Submit.jsx'

import {
	exchangeFromTo,
	showCitySelector,
} from './actions'

function App(props) {
	const {
		from,
		to,
		dispatch,
	} = props;

	const onBack = useCallback(() => {
		window.history.back();
	},[]);

	const cbs = useMemo(() => {
		return bindActionCreators({
			exchangeFromTo,
			showCitySelector
		}, dispatch);
	},[])

	return(
		<div>
			<div className="header-wrapper">
				<Header title="Train Ticket" onBack={onBack}/>
			</div>
			<form className="form">
				<Journey 
					from={from} 
					to={to}
					{...cbs}
				/>
				<DepartDate/>
				<HighSpeed/>
				<Submit/>
			</form>
		</div>

	);

}

export default connect(
	function mapStateToProps(state) {
		return state;
	},
	function mapDispatchToProps(dispatch) {
		return { dispatch };
	}
)(App);