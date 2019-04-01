/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button, Icon, Input, Modal } from "semantic-ui-react";
import { ActionType } from "typesafe-actions";

import { addChannel, changeChannel } from "@lib/actions/Channel";
import actions from "@lib/actions/RootAction";
import IChannel from "@lib/types/Channel";
import IUser from "@lib/types/User";
import { outline } from "../constants/Colours";
import { IRootState } from "../store";

interface IProps {
	addChannel: typeof addChannel;
	changeChannel: typeof changeChannel;
	channelList: IChannel[];
	user: IUser;
}
interface IState {
	newChannelName: string;
	modalOpen: boolean;
}

const Styles = css`
	padding: 1rem 0;

	h3 {
		margin: 0;
		padding: 0 1rem;
	}
	hr {
		margin: 1rem 0;
		border: 0.5px solid ${outline};
	}
	ul {
		padding: 0 1rem;
		list-style: none;
		.channel {
			cursor: pointer;
		}
	}
	#new-channel {
		cursor: pointer;
	}
`;

const ModalStyles = css`
	&#channel-modal {
		text-align: center;

		.channel-name {
			display: block;
		}
		button {
			margin-top: 1rem;
		}
	}
`;

class ChannelList extends React.Component<IProps, IState> {
	// Initial state
	public readonly state: IState = {
		newChannelName: "",
		modalOpen: false,
	};

	public render(): JSX.Element {
		const channelList: JSX.Element[] = this.props.channelList.map((channel: IChannel) => (
			<li key={channel.id}>
				<span id={channel.id} className="channel" onClick={this.handleChangeChannel}>
					{channel.name}
				</span>
			</li>
		));

		// Note: Modal is a list element because it is rendered as the New button
		return (
			<div id="channel-list" css={Styles}>
				<h3>Channels:</h3>
				<hr />
				<ul>
					{channelList}
					<li>
						<Modal
							id="channel-modal"
							css={ModalStyles}
							size="mini"
							trigger={
								<span id="new-channel" onClick={this.handleModalOpen}>
									<Icon name="plus" />
									New
								</span>
							}
							open={this.state.modalOpen}
							onClose={this.handleModalClose}
						>
							<Modal.Header>
								<h2>Create Channel</h2>
							</Modal.Header>
							<Modal.Content>
								<form autoComplete="off" onSubmit={this.handleNewChannel}>
									<Input
										className="channel-name"
										value={this.state.newChannelName}
										onChange={this.handleChannelNameChange}
									/>
									<Button>Create</Button>
								</form>
							</Modal.Content>
						</Modal>
					</li>
				</ul>
			</div>
		);
	}

	/* Handlers */

	// Manually control modal so that we can close on submit
	private handleModalOpen = (): void => {
		this.setState({ modalOpen: true });
	};

	private handleModalClose = (): void => {
		this.setState({ modalOpen: false });
	};

	// Close modal on channel submit
	private handleNewChannel = (event: React.FormEvent): void => {
		event.preventDefault();

		this.setState({
			modalOpen: false,
		});

		this.props.addChannel(this.state.newChannelName);
	};

	// Update new channel name
	private handleChannelNameChange = (event: React.FormEvent<HTMLInputElement>): void => {
		this.setState({
			newChannelName: event.currentTarget.value,
		});
	};

	// Change channel
	private handleChangeChannel = (event: React.MouseEvent<HTMLSpanElement>): void => {
		const channelID = event.currentTarget.id;

		this.props.changeChannel(this.props.user.id, channelID);
	};
}

/* Redux Methods */

const mapStateToProps = (state: IRootState) => {
	return { channelList: state.channels, user: state.user };
};

const mapDispatchToProps = (dispatch: Dispatch<ActionType<typeof actions>>) => {
	return {
		addChannel: (name: string) => dispatch(addChannel(name)),
		changeChannel: (userID: string, channelID: string) => dispatch(changeChannel(userID, channelID)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ChannelList);
