import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app";
import "@fontsource/roboto";
import "./index.css";
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "@/dev";
import { store } from "@/app/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
      <Provider store={store}>
        <App />
      </Provider>
    </DevSupport>
  </React.StrictMode>
);
