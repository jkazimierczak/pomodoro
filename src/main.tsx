import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
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
