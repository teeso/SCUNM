﻿import React from "react";
import { connect } from "react-redux";
import { selectVerbElto } from "../../reduxActions/actions";

class VerbMenuElement extends React.Component {
	get displayName() { return 'VerbMenuElement'; }

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		this.props.selectVerbElto();
	}

	render() {
		return (
			<li className="menu" onClick={this.handleClick}>
				Verbs
      </li>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		selectVerbElto: () => dispatch(selectVerbElto())
	};
};

const VerbMenu = connect(null, mapDispatchToProps)(VerbMenuElement);
export default VerbMenu;