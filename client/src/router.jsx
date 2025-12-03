import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ProjectPage from "./pages/ProjectPage";
import DeckPage from "./pages/DeckPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "projects/:projectId", element: <ProjectPage /> },
      { path: "decks/:deckId", element: <DeckPage /> },
    ],
  },
]);
