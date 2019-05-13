import React from "react";
import { render } from "react-dom";
import { Provider } from "react-dom";
import App from "./app";
import store from "./rootStore";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
