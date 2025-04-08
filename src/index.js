import React from "react";
import ReactDOM from "react-dom";
import ColorPopGame from "./ColorPopGame";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ColorPopGame />
  </React.StrictMode>,
  document.getElementById("root")
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((registration) => {
        console.log("ServiceWorker registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("ServiceWorker registration failed: ", registrationError);
      });
  });
}