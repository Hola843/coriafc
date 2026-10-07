import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// El favicon lo gestiona el componente <Favicon /> dentro de App, que usa
// el escudo subido desde el panel o, en su defecto, el archivo de public/.

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
