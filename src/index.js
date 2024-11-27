import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
import RisingStar from "./RisingStar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <RisingStar maxRating={10} />
    <RisingStar maxRating={20} color="blue" size={34} />
  </React.StrictMode>
);
