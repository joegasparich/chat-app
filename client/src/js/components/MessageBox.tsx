/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { EmojiData, Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ActionType } from "typesafe-actions";

import { addMessage } from "@lib/actions/Message";
import actions from "@lib/actions/RootAction";
import { startTyping, stopTyping } from "@lib/actions/User";
import IUser from "@lib/types/User";
import { Button, Input } from "semantic-ui-react";
import { IRootState } from "../store";

interface IProps {
	addMessage: typeof addMessage;
	startTyping: typeof startTyping;
	stopTyping: typeof stopTyping;
	user: IUser;
}

interface IState {
	content: string;
	typing: boolean;
	lastTyped: Date;
	showEmojis: boolean;
}

const Styles = css`
	display: flex;
	line-height: 1rem;
	min-height: 40px;

	.ui.basic.buttons {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
	.ui.fluid.input {
		flex-grow: 1;
	}
	#emoji {
		position: relative;
		height: 100%;
		z-index: 10;

		#emoji-button {
			width: 38px;
			height: 100%;
			margin: 0;
			padding: 0;
			border-right: none;
			border-radius: 0;
			filter: grayscale(100%) contrast(200%);
			font-size: 17px;
		}
		.emoji-mart {
			position: absolute;
			bottom: calc(100% + 2px);
			left: -150px;
		}
		.emoji-mart-emoji:hover {
			::before {
				display: none !important;
			}
		}

		.emoji-mart-emoji span {
			cursor: pointer;
		}
	}
	#send-button {
		margin-left: -1px;
	}
`;

class MessageBox extends React.Component<IProps, IState> {
	// Initial state
	public readonly state: IState = {
		content: "",
		typing: false,
		lastTyped: new Date(),
		showEmojis: false,
	};

	// Refs
	private emojiPanelRef: React.RefObject<HTMLDivElement> = React.createRef();

	// Lifecycle Methods
	public componentDidMount() {
		document.addEventListener("mousedown", this.handleClick);
	}

	public componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleClick);
	}

	public render() {
		return (
			<form id="message-box" autoComplete="off" css={Styles} onSubmit={this.handleSubmit}>
				<Input id="message-content" type="text" fluid action>
					<input value={this.state.content} onChange={this.handleChange} />
					<div id="emoji" className="noselect">
						<Button basic id="emoji-button" type="button" onClick={this.handleEmojiButtonClicked}>
							🙂
						</Button>
						{this.state.showEmojis && (
							<div id="emoji-picker" ref={this.emojiPanelRef}>
								<Picker native showPreview={false} onSelect={this.addEmoji} />
							</div>
						)}
					</div>
					<Button basic id="send-button" type="submit">
						Send
					</Button>
				</Input>
			</form>
		);
	}

	// Handles message box input
	private handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
		this.setState({ content: event.currentTarget.value });

		if (!this.state.typing) {
			this.setState({ typing: true });
			this.props.startTyping(this.props.user);
		}

		this.setState({ lastTyped: new Date() });
		setTimeout(() => {
			if (new Date().getTime() > this.state.lastTyped.getTime() + 999) {
				this.setState({ typing: false });
				this.props.stopTyping(this.props.user);
			}
		}, 1000);
	};

	// Send message on form submit
	private handleSubmit = (event: React.FormEvent): void => {
		event.preventDefault();

		if (!this.state.content) return;

		this.props.addMessage(this.props.user, this.state.content);

		this.setState({
			content: "",
		});
	};

	// Checks for clicks outside of the emoji panel
	private handleClick = (event: MouseEvent): void => {
		if (!this.state.showEmojis) return;
		if (!this.emojiPanelRef.current) return;
		if (!(event.target instanceof Element)) return;

		if (!this.emojiPanelRef.current.contains(event.target) && event.target.id !== "emoji-button") {
			this.setState({
				showEmojis: false,
			});
		}
	};

	// Handles opening and closing of the emoji panel
	private handleEmojiButtonClicked = (event: React.FormEvent): void => {
		event.preventDefault();

		this.setState({
			showEmojis: !this.state.showEmojis,
		});
	};

	// Converts emoji code into unicode and appends it to the message
	private addEmoji = (emoji: EmojiData) => {
		this.setState({
			content: this.state.content + emoji.colons,
		});
	};
}

// Redux methods
const mapStateToProps = (state: IRootState) => {
	return {
		user: state.user,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof actions>>) => {
	return {
		addMessage: (user: IUser, content: string) => dispatch(addMessage(user, content)),
		startTyping: (user: IUser) => dispatch(startTyping(user)),
		stopTyping: (user: IUser) => dispatch(stopTyping(user)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(MessageBox);
