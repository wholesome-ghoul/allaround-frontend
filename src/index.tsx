import React from "react";
import { createRoot } from "react-dom/client";
import { CommonScss } from "@allaround/all-components";

CommonScss.reset().common();
import App from "./App";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
