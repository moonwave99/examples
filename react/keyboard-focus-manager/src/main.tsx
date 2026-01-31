import { createRoot } from "react-dom/client";
import { FocusProvider } from "./contexts/FocusContext.tsx";
import App from "./App.tsx";

const ids = ["A", "B", "C", "D"];

createRoot(document.getElementById("root")!).render(
  <FocusProvider>
    <App ids={ids} />
  </FocusProvider>,
);
