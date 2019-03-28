import { Store } from "redux";

import { Actions } from "@lib/actions/RootAction";

interface ISocketAction {
	type: number;
	nsp: string;
	data: [string, Actions];
}

export default (socket: SocketIOClient.Socket) => (store: Store) => {
	socket.on("*", (socketAction: ISocketAction) => {
		const action: Actions = socketAction.data[1];
		// Clear meta so messages don't get sent back
		delete action.meta;
		store.dispatch(action);
	});

	return (next: (action: Actions) => Actions) => (action: Actions) => {
		if (action.meta && action.meta.remote) {
			socket.emit(action.type, action);
		}
		return next(action);
	};
};
