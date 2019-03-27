import { action } from "typesafe-actions";
import uuid from "uuid";

import IChannel from "../types/Channel";
import { ChannelActionTypes } from "./../constants/ActionTypes";

export const changeChannel = (channelID: string) =>
	action(ChannelActionTypes.CHANGE_CHANNEL, { channelID }, { remote: false });

export const addChannel = (name: string) =>
	action(
		ChannelActionTypes.ADD_CHANNEL,
		{
			channel: {
				id: uuid(),
				name,
				messages: [],
			} as IChannel,
		},
		{ remote: true },
	);

export const addChannels = (channels: IChannel[]) =>
	action(ChannelActionTypes.ADD_CHANNELS, { channels }, { remote: true });
