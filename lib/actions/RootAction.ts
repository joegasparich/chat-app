import { ActionType } from "typesafe-actions";

import * as channelActions from "./Channel";
import * as messageActions from "./Message";
import * as userActions from "./User";

const actions = {
	channel: channelActions,
	message: messageActions,
	user: userActions,
};

export default actions;

export type Actions = ActionType<typeof actions>;
