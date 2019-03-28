/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { connect } from "react-redux";

import IChannel from "@lib/types/Channel";
import IMessage from "@lib/types/Message";
import IUser from "@lib/types/User";
import { IRootState } from "../store";
import Message from "./Message";

interface IProps {
	user: IUser | undefined;
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
		if (!this.props.channels || !this.props.user) return <div id="messages" css={Styles} ref={this.messagesRef} />;
		const channelID: string = this.props.user.channelID;

		const channel: IChannel | undefined = this.props.channels.find((c: IChannel) => c.id === channelID);
		if (!channel) return <div id="messages" css={Styles} ref={this.messagesRef} />;

		const messageList: JSX.Element[] = channel.messages.map((message: IMessage) => (
			<li key={message.id}>
				<Message source={message.user} content={message.content} />
			</li>
		));

		return (
			<div id="messages" css={Styles} ref={this.messagesRef}>
				<ul>{messageList}</ul>
			</div>
		);
	}

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
