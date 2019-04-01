/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";

import IUser from "@lib/types/User";

export enum MessageType {
	Sent = "sent",
	Received = "received",
	Server = "server",
}

interface IProps {
	source: IUser;
	content: string;
	type: MessageType;
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

		return (
			<div css={Styles} className={"message " + this.props.type}>
				{!fromServer && <strong>{this.props.source.name}: </strong>}
				{this.props.content}
			</div>
		);
	}
}

export default Message;
