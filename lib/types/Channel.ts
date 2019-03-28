import IMessage from "./Message";

export default interface IChannel {
	id: string;
	name: string;
	messages: IMessage[];
}
