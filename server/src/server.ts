import express from "express";
import { Request, Response } from "express-serve-static-core";
import fs from "fs";
import http from "http";
import SocketIO from "socket.io";
import { ActionType } from "typesafe-actions";
import uuid from "uuid";

import { addChannel, addChannels, changeChannel } from "@lib/actions/Channel";
import { addMessage, updateMessages } from "@lib/actions/Message";
import { logIn, startTyping, stopTyping, updateUsers, updateUsersTyping } from "@lib/actions/User";
import ActionTypes from "@lib/constants/ActionTypes";
import IChannel from "@lib/types/Channel";
import IMessage from "@lib/types/Message";
import IUser from "@lib/types/User";
import { MessageFilePath, UserFilePath } from "./constants/Paths";
import IMessageData from "./types/MessageData";
import IUserData from "./types/UserData";

const app: express.Express = express();
const server: http.Server = http.createServer(app);
const io: SocketIO.Server = SocketIO(server);

let userList: IUser[] = [];
let onlineUsers: IUser[] = [];
let channelList: IChannel[] = [];
let generalChannel: IChannel;

const serverUser: IUser = {
	id: "1",
	name: "Server",
	typing: false,
	channelID: "-1",
};

// Endpoint that return whether user exists in server
app.get("/user/:username", (req: Request, res: Response) => {
	res.send(onlineUsers.filter((user: IUser) => user.name === req.params.username).length > 0);
});

// On socket connection
io.on("connection", (socket: SocketIO.Socket) => {
	// Declare new user in scope of connection
	let currentUser: IUser;

	// On new user
	socket.on(ActionTypes.LOG_IN, (action: ActionType<typeof logIn>) => {
		currentUser = action.payload.user;
		// Send channel list
		socket.emit(ActionTypes.ADD_CHANNELS, addChannels(channelList));

		let messageContent: string;

		// Check if user already exists
		const existingUser = userList.find((user: IUser) => user.name === currentUser.name);
		if (existingUser) {
			currentUser = existingUser;
			messageContent = currentUser.name + " has logged in";
		} else {
			messageContent = currentUser.name + " has joined";
			newUser(currentUser);
		}

		// Return user object
		socket.emit(ActionTypes.LOG_IN, {
			type: ActionTypes.LOG_IN,
			payload: { user: currentUser },
		});

		// Change to user's channel
		socket.emit(ActionTypes.CHANGE_CHANNEL, changeChannel(currentUser.id, currentUser.channelID));

		// Send new user message
		sendMessage(addMessage(serverUser, messageContent, generalChannel.id));

		// Update user list
		onlineUsers.push(currentUser);
		io.emit(ActionTypes.UPDATE_USERS, updateUsers(onlineUsers));
	});

	// On server receives message
	socket.on(ActionTypes.ADD_MESSAGE, (action: ActionType<typeof addMessage>) => {
		// Send message
		sendMessage(action);

		// Stop displaying as typing
		if (currentUser) {
			currentUser.typing = false;
		}
		io.emit(ActionTypes.UPDATE_USERS_TYPING, updateUsersTyping(onlineUsers.filter((user: IUser) => user.typing)));
	});

	// Typing indicators
	socket.on(ActionTypes.USER_START_TYPING, (action: ActionType<typeof startTyping>) => {
		const typingUser: IUser = action.payload.user;
		onlineUsers.map((u: IUser) => {
			if (u.id === typingUser.id) {
				u.typing = true;
			}
		});
		io.emit(ActionTypes.UPDATE_USERS_TYPING, updateUsersTyping(onlineUsers.filter((user: IUser) => user.typing)));
	});
	socket.on(ActionTypes.USER_STOP_TYPING, (action: ActionType<typeof stopTyping>) => {
		const typingUser: IUser = action.payload.user;
		onlineUsers.map((u: IUser) => {
			if (u.id === typingUser.id) {
				u.typing = false;
			}
		});
		io.emit(ActionTypes.UPDATE_USERS_TYPING, updateUsersTyping(onlineUsers.filter((user: IUser) => user.typing)));
	});

	socket.on(ActionTypes.CHANGE_CHANNEL, (action: ActionType<typeof changeChannel>) => {
		userList.find((user: IUser) => user.id === action.payload.userID).channelID = action.payload.channelID;

		socket.emit(
			ActionTypes.UPDATE_MESSAGES,
			updateMessages(
				channelList.find((c: IChannel) => c.id === action.payload.channelID).messages,
				action.payload.channelID,
			),
		);
		socket.emit(ActionTypes.CHANGE_CHANNEL, action);
	});

	// On user adds a new channel
	socket.on(ActionTypes.ADD_CHANNEL, (action: ActionType<typeof addChannel>) => {
		const newChannel: IChannel = action.payload.channel;

		newChannel.messages.push({
			id: uuid(),
			content: `Welcome to ${action.payload.channel.name}`,
			user: serverUser,
			time: new Date(),
		});

		channelList.push(newChannel);

		io.emit(ActionTypes.ADD_CHANNEL, action);
		// Change channel to new channel
		currentUser.channelID = newChannel.id;
		socket.emit(ActionTypes.CHANGE_CHANNEL, changeChannel(currentUser.id, currentUser.channelID));
	});

	// User disconnects
	socket.on("disconnect", () => {
		if (currentUser) {
			// Cancel typing
			currentUser.typing = false;
			io.emit(
				ActionTypes.UPDATE_USERS_TYPING,
				updateUsersTyping(onlineUsers.filter((user: IUser) => user.typing)),
			);
			// Send disconnect message
			const messageContent: string = currentUser.name + " disconnected";
			sendMessage(addMessage(serverUser, messageContent, generalChannel.id));
			// Update user list
			onlineUsers = onlineUsers.filter((user: IUser) => user.name !== currentUser.name);
			io.emit(ActionTypes.UPDATE_USERS, updateUsers(onlineUsers));
		}
	});
});

// Sends a message to all connections and saves it to file
const sendMessage = (action: ActionType<typeof addMessage>): void => {
	// Send messages to all users
	io.emit(ActionTypes.ADD_MESSAGE, action);

	// Save message
	const message: IMessage = action.payload.message;
	const channel: IChannel = channelList.find((c: IChannel) => c.id === action.payload.channelID);

	if (!channel) {
		console.error(`ERROR: Can't send message, channel ${action.payload.channelID} does not exist`);
		return;
	} else {
		console.log(`Message: ${action.payload.message.content}`);
	}

	channel.messages.push(message);
	// Save to file
	readJson(
		MessageFilePath,
		(messageData: IMessageData): void => {
			messageData.channels = channelList;
			const json: string = JSON.stringify(messageData);
			fs.writeFile(MessageFilePath, json, "utf8", () => {
				return;
			});
		},
	);
};

// Adds a user to the system
const newUser = (user: IUser): void => {
	console.log(`new user: ${user.name}`);
	user.channelID = generalChannel.id;
	userList.push(user);
	// Save to file
	readJson(
		UserFilePath,
		(userData: IUserData): void => {
			userData.users.push(user);
			const json: string = JSON.stringify(userData);
			fs.writeFile(UserFilePath, json, "utf8", () => {
				return;
			});
		},
	);
};

// Returns an object from a json file
function readJson(path: string, callback: (object: any) => any): void {
	fs.readFile(
		path,
		"utf8",
		(err, data: string): void => {
			if (err) {
				console.error(err);
			} else {
				callback(JSON.parse(data));
			}
		},
	);
}

// Either creates or gets a file to store messages in
async function getFiles(): Promise<void> {
	// Users
	if (fs.existsSync(UserFilePath)) {
		readJson(
			UserFilePath,
			(userData: IUserData): void => {
				userList = userData.users;
			},
		);
	} else {
		fs.writeFile(
			UserFilePath,
			JSON.stringify({
				users: [],
			}),
			() => {
				return;
			},
		);
	}

	// Messages
	if (fs.existsSync(MessageFilePath)) {
		readJson(
			MessageFilePath,
			(messageData: IMessageData): void => {
				channelList = messageData.channels;
				generalChannel = messageData.channels[0];
			},
		);
	} else {
		generalChannel = {
			id: "1",
			name: "General",
			messages: [
				{
					id: uuid(),
					content: "Welcome to General",
					user: serverUser,
					time: new Date(),
				},
			],
		};
		channelList = [generalChannel];

		fs.writeFile(
			MessageFilePath,
			JSON.stringify({
				channels: [generalChannel],
			}),
			() => {
				return;
			},
		);
	}
}

// Start the server
server.listen(3000, () => {
	console.log("listening on *:3000");

	getFiles();
});
