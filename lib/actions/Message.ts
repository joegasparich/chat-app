import { action } from "typesafe-actions";
import uuid from "uuid";

import { MessageActionTypes } from "../constants/ActionTypes";
import IMessage from "../types/Message";
import IUser from "../types/User";

export const addMessage = (user: IUser, channelID: string, content: string) =>
	action(
		MessageActionTypes.ADD_MESSAGE,
		{
			message: {
				id: uuid(),
				user,
				content,
				time: new Date(),
			} as IMessage,
			channelID,
		},
		{ remote: true },
	);

export const addMessages = (messages: IMessage[], channelID: string) =>
	action(MessageActionTypes.ADD_MESSAGES, { messages, channelID }, { remote: false });

export const requestMessages = (channelID: string) =>
	action(MessageActionTypes.REQUEST_MESSAGES, { channelID }, { remote: true });
