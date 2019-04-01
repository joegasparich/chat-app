/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { connect } from "react-redux";

import IChannel from "@lib/types/Channel";
import IMessage from "@lib/types/Message";
import IUser from "@lib/types/User";
import { IRootState } from "../store";
import Message, { MessageType } from "./Message";

interface IProps {
	user: IUser;
	channels: IChannel[];
}

interface IState {}

const Styles = css`
	overflow-y: scroll;

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	::-webkit-scrollbar {
		width: 0;
	}
`;

class Messages extends React.Component<IProps, IState> {
	private messagesRef = React.createRef<HTMLDivElement>();

	// Lifecycle Methods
	// TODO: Find a way to only scroll if a new message
	public componentDidMount() {
		this.scrollToBottom();
	}

	public componentDidUpdate() {
		this.scrollToBottom();
	}

	public render(): JSX.Element {
		// Get current channel
		const channel: IChannel | undefined = this.props.channels.find(
			(c: IChannel) => c.id === this.props.user.channelID,
		);
		// If in non-existent channel then show empty div
		if (!channel) return <div id="messages" css={Styles} ref={this.messagesRef} />;

		// Generate message components
		const messageList: JSX.Element[] = channel.messages.map((message: IMessage) => {
			const type: MessageType =
				message.user.id === "1"
					? MessageType.Server
					: message.user.id === this.props.user.id
					? MessageType.Sent
					: MessageType.Received;

			return (
				<li key={message.id}>
					<Message source={message.user} content={message.content} type={type} />
				</li>
			);
		});

		return (
			<div id="messages" css={Styles} ref={this.messagesRef}>
				<ul>{messageList}</ul>
			</div>
		);
	}

	// Scrolls to the bottom of the element
	private scrollToBottom() {
		const div = this.messagesRef.current;
		if (div) {
			const scrollHeight = div.scrollHeight;
			const height = div.clientHeight;
			const maxScrollTop = scrollHeight - height;
			div.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
		}
	}
}

// Redux methods
const mapStateToProps = (state: IRootState): IProps => {
	return {
		user: state.user,
		channels: state.channels,
	};
};

export default connect(
	mapStateToProps,
	null,
)(Messages);
