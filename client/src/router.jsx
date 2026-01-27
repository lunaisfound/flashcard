import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import App from "./App";
import ProjectPage from "./pages/ProjectPage";
import DeckPage from "./pages/DeckPage";
import EditDeckPage from "./pages/EditDeckPage";
import DashboardPage from "./pages/DashboardPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },

  {
    path: "/app",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "projects/:projectId", element: <ProjectPage /> },
      { path: "decks/:deckId", element: <DeckPage /> },
      { path: "decks/:deckId/edit", element: <EditDeckPage /> },
    ],
  },
]);
