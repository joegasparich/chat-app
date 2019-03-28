import IUser from "./User";

export default interface IMessage {
	id: string;
	user: IUser;
	content: string;
	time: Date;
}
