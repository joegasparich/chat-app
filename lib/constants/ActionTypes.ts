export enum UserActionTypes {
	LOG_IN = "LOG_IN",
	UPDATE_USERS = "UPDATE_USERS",
	USER_START_TYPING = "USER_START_TYPING",
	USER_STOP_TYPING = "USER_STOP_TYPING",
	UPDATE_USERS_TYPING = "UPDATE_USERS_TYPING",
}

export enum MessageActionTypes {
	ADD_MESSAGES = "ADD_MESSAGES",
	ADD_MESSAGE = "ADD_MESSAGE",
	REQUEST_MESSAGES = "REQUEST_MESSAGES",
}

export enum ChannelActionTypes {
	CHANGE_CHANNEL = "CHANGE_CHANNEL",
	ADD_CHANNEL = "ADD_CHANNEL",
	ADD_CHANNELS = "ADD_CHANNELS",
}

const ActionTypes = { ...UserActionTypes, ...MessageActionTypes, ...ChannelActionTypes };

export default ActionTypes;
