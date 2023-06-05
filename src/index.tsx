import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.scss";
import Home from "./home";
import SignUp from "./sign-up";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/tmp" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
