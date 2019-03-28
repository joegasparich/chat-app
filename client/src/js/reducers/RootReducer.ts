import { Reducer } from "redux";
import { IRootState } from "../Store";

import { Actions } from "@lib/actions/RootAction";
import ActionTypes from "@lib/constants/ActionTypes";
import IChannel from "@lib/types/Channel";

const initialState: IRootState = {
	user: undefined,
	messages: [],
	channels: [],
	usersOnline: [],
	usersTyping: [],
};

const rootReducer: Reducer<IRootState> = (state: IRootState = initialState, action: Actions) => {
	// Cancel action if it was meant for server
	if (action.meta && action.meta.remote) {
		return state;
	}

	let channels: IChannel[];
	let channel: IChannel | undefined;

	switch (action.type) {
		// Server returns user object after log in request
		case ActionTypes.LOG_IN:
			return Object.assign({}, state, {
				user: action.payload.user,
			});
		// Server sends message
		case ActionTypes.ADD_MESSAGE:
			channels = [...state.channels];
			channel = state.channels.find((c: IChannel) => c.id === action.payload.channelID);
			if (!channel) return state;

			channel.messages = channel.messages.concat(action.payload.message);
			return Object.assign({}, state, {
				channels,
			});
		// Server sends multiple messages
		case ActionTypes.ADD_MESSAGES:
			channels = [...state.channels];
			channel = channels.find((c: IChannel) => c.id === action.payload.channelID);
			if (!channel) return state;

			channel.messages = channel.messages.concat(action.payload.messages); // Append
			return Object.assign({}, state, {
				channels,
			});
		// Server replaces messages with new ones
		case ActionTypes.UPDATE_MESSAGES:
			channels = [...state.channels];
			channel = channels.find((c: IChannel) => c.id === action.payload.channelID);
			if (!channel) return state;

			channel.messages = action.payload.messages; // Overwrite
			return Object.assign({}, state, {
				channels,
			});
		// User joins or leaves
		case ActionTypes.UPDATE_USERS:
			return Object.assign({}, state, {
				usersOnline: action.payload.users,
			});
		// User starts or stops typing
		case ActionTypes.UPDATE_USERS_TYPING:
			return Object.assign({}, state, {
				usersTyping: action.payload.users,
			});
		// User changes channel
		case ActionTypes.CHANGE_CHANNEL:
			if (!state.user) return state;
			const user = Object.assign({}, state.user);
			user.channelID = action.payload.channelID;

			return Object.assign({}, state, {
				user,
			});
		case ActionTypes.ADD_CHANNEL:
			return Object.assign({}, state, {
				channels: state.channels.concat(action.payload.channel),
			});
		case ActionTypes.ADD_CHANNELS:
			return Object.assign({}, state, {
				channels: state.channels.concat(action.payload.channels),
			});
		default:
			return state;
	}
};

export default rootReducer;
