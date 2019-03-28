/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";

import { outline } from "../../constants/Colours";
import ChannelList from "../ChannelList";
import MessageBox from "../MessageBox";
import Messages from "../Messages";
import TypingIndicator from "../TypingIndicator";
import UserList from "../UserList";

const Styles = css`
	display: flex;
	height: 100vh;

	#channel-list {
		width: 20%;
		border-right: 1px ${outline} solid;
	}

	#message-area {
		flex-grow: 1;
		display: flex;
		flex-flow: column nowrap;
		margin: 0 2rem 2rem 2rem;

		#messages {
			flex-grow: 1;
		}
	}

	#user-list {
		width: 20%;
		border-left: 1px ${outline} solid;
	}
`;

class Chat extends React.Component {
	public readonly state = {
		username: "",
	};

	public render() {
		return (
			<div id="chat" css={Styles}>
				<ChannelList />
				<div id="message-area">
					<Messages />
					<TypingIndicator />
					<MessageBox />
				</div>
				<UserList />
			</div>
		);
	}
}

export default Chat;
