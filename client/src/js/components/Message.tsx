/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { connect } from "react-redux";

import IUser from "@lib/types/User";
import { IRootState } from "../store";

interface IProps {
	currentUser: IUser;
	source: IUser;
	content: string;
}
interface IState {}

const Styles = css`
	margin: 15px 0;

	&.sent {
		text-align: right;
	}
	&.received {
		text-align: left;
	}
	&.server {
		text-align: center;
		font-style: italic;
	}
`;

class Message extends React.Component<IProps, IState> {
	public readonly state = {};

	public render(): JSX.Element {
		const fromServer: boolean = this.props.source.id === "1";
		const sourceClass: string = fromServer
			? "server"
			: this.props.source.id === this.props.currentUser.id
			? "sent"
			: "received";

		return (
			<div css={Styles} className={"message " + sourceClass}>
				{!fromServer && <strong>{this.props.source.name}: </strong>}
				{this.props.content}
			</div>
		);
	}
}

const mapStateToProps = (state: IRootState) => {
	return {
		currentUser: state.user,
	};
};

export default connect(
	mapStateToProps,
	null,
)(Message);
