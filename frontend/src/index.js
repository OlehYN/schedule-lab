// vendor
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// own
import App from "./App";
import store from "./redux/store.js";

// React APP entry point
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
