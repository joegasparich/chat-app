import IChannel from "@lib/types/Channel";
import IMessage from "@lib/types/Message";
import IUser from "@lib/types/User";
import { AnyAction, applyMiddleware, createStore, Store } from "redux";
import io from "socket.io-client";
import wildcard from "socketio-wildcard";

import rootReducer from "./reducers/RootReducer";

import logger from "./middleware/Logger";
import Socket from "./middleware/Socket";

const socket: SocketIOClient.Socket = io.connect("localhost:3000/");
const patch = wildcard(io.Manager);
patch(socket);

export interface IRootState {
	user?: IUser;
	messages: IMessage[];
	channels: IChannel[];
	usersOnline: IUser[];
	usersTyping: IUser[];
}

const store: Store<IRootState, AnyAction> = createStore(rootReducer, applyMiddleware(logger, Socket(socket)));

export default store;
