import { createStore, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import rootReducer from "./reducers/rootReducer";

const dev = process.env.NODE_ENV === "development";
const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers = dev && devtools ? devtools : compose;

export default createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware),
    composeEnhancers()
);
