/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { connect } from "react-redux";

import IUser from "@lib/types/User";
import { outline } from "../constants/Colours";
import { IRootState } from "../store";

interface IProps {
	usersOnline: IUser[];
}
interface IState {}

const Styles = css`
	padding: 1rem 0;
	border-left: 1px ${outline} solid;

	h3 {
		margin: 0;
		padding: 0 1rem;
	}
	hr {
		margin: 1rem 0;
		border: 0.5px solid ${outline};
	}
	ul {
		padding: 0 1rem;
		list-style: none;
	}
`;

class UserList extends React.Component<IProps, IState> {
	public readonly state: IState = {};

	public render(): JSX.Element {
		const userList: JSX.Element[] = this.props.usersOnline.map((user: IUser) => <li key={user.id}>{user.name}</li>);

		return (
			<div id="user-list" css={Styles}>
				<h3>Users Online:</h3>
				<hr />
				<ul>{userList}</ul>
			</div>
		);
	}
}

const mapStateToProps = (state: IRootState) => {
	return { usersOnline: state.usersOnline };
};

export default connect(
	mapStateToProps,
	null,
)(UserList);
