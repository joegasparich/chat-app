import { action } from "typesafe-actions";
import uuid from "uuid";

import { UserActionTypes } from "../constants/ActionTypes";
import IUser from "../types/User";

export const logIn = (name: string) =>
	action(
		UserActionTypes.LOG_IN,
		{
			user: {
				id: uuid(),
				name,
			} as IUser,
		},
		{ remote: true },
	);

export const startTyping = (user: IUser) => action(UserActionTypes.USER_START_TYPING, { user }, { remote: true });
export const stopTyping = (user: IUser) => action(UserActionTypes.USER_STOP_TYPING, { user }, { remote: true });

export const updateUsersTyping = (users: IUser[]) =>
	action(UserActionTypes.UPDATE_USERS_TYPING, { users }, { remote: false });

export const updateUsers = (users: IUser[]) => action(UserActionTypes.UPDATE_USERS, { users }, { remote: false });
