import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import "semantic-ui-css/semantic.min.css";
import "../css/base.css";
import "../css/utility.css";

import App from "./components/App";
import store from "./Store";

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("root"),
);
