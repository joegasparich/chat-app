import * as React from "react";
import { hot } from "react-hot-loader";
import { connect } from "react-redux";

import IUser from "@lib/types/User";
import { IRootState } from "../store";
import Chat from "./pages/Chat";
import LogIn from "./pages/LogIn";

interface IProps {
	user: IUser;
}

class App extends React.Component<IProps, {}> {
	public render(): JSX.Element {
		return <div className="App">{!this.props.user ? <LogIn /> : <Chat />}</div>;
	}
}

const mapStateToProps = (state: IRootState) => {
	return { user: state.user };
};

export default hot(module)(
	connect(
		mapStateToProps,
		null,
	)(App),
);
