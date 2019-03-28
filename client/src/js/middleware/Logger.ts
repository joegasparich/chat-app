import { Store } from "redux";

import { Actions } from "@lib/actions/RootAction";

const logger = (store: Store) => (next: (action: Actions) => Actions) => (action: Actions) => {
	if (action.meta && action.meta.remote) {
		// tslint:disable-next-line:no-console
		console.log("sending", action);
		return next(action);
	}
	// tslint:disable-next-line:no-console
	console.log("dispatching", action);
	const result = next(action);
	// tslint:disable-next-line:no-console
	console.log("next state", store.getState());
	return result;
};

export default logger;
