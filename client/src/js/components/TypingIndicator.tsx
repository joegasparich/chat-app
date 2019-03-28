/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { connect } from "react-redux";

import IUser from "@lib/types/User";
import { IRootState } from "../store";

interface IProps {
	user: IUser;
	usersTyping: IUser[];
}
interface IState {}

const Styles = css``;

class TypingIndicator extends React.Component<IProps, IState> {
	public readonly state = {};

	public render(): JSX.Element {
		const users: string[] = this.props.usersTyping
			.filter((user: IUser) => user.channelID === this.props.user.channelID)
			.map((user: IUser) => user.name);
		const typingMessage: string = this.props.usersTyping.length > 0 ? users.join(", ") + " typing..." : "";

		return (
			<div id="typing-indicator" css={Styles}>
				{typingMessage}
			</div>
		);
	}
}

const mapStateToProps = (state: IRootState) => {
	return {
		user: state.user,
		usersTyping: state.usersTyping,
	};
};

export default connect(
	mapStateToProps,
	null,
)(TypingIndicator);
