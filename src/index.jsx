import { createRoot } from "react-dom/client";
import { SpaContainer } from "pankosmia-rcl";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import NewTranslationPlan from "./pages/NewTranslationPlanContent";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "createDocument/translationPlan",
    element: <NewTranslationPlan />,
  },
]);

createRoot(document.getElementById("root")).render(
  <SpaContainer>
    <RouterProvider router={router} />
  </SpaContainer>,
);
