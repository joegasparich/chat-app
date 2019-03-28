/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button, Header, Input } from "semantic-ui-react";
import { ActionType } from "typesafe-actions";

import { logIn } from "@lib/actions/User";

interface IProps {
	logIn: typeof logIn;
}

interface IState {
	username: string;
}

const Styles = css`
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;

	.ui.input {
		display: block;
		margin-bottom: 1rem;
	}
`;

class LogIn extends React.Component<IProps, IState> {
	public readonly state = {
		username: "",
	};

	public render() {
		return (
			<div id="log-in" css={Styles} className="container">
				<form id="enter-name" autoComplete="off" onSubmit={this.handleSubmit}>
					<Header htmlFor="nickname">Nickname</Header>
					<Input type="text" id="nickname" value={this.state.username} onChange={this.handleChange} />
					<Button basic className="button-primary" type="submit">
						Join
					</Button>
				</form>
			</div>
		);
	}

	// Handles input change
	private handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
		this.setState({ username: event.currentTarget.value });
	};

	// Handles login submission
	private handleSubmit = (event: React.FormEvent): void => {
		event.preventDefault();

		this.props.logIn(this.state.username);

		this.setState({
			username: "",
		});
	};
}

const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof logIn>>) => {
	return {
		logIn: (name: string) => dispatch(logIn(name)),
	};
};

export default connect(
	null,
	mapDispatchToProps,
)(LogIn);
