import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { MainPage } from "./pages/mainPage";
import { TaskPage } from "./pages/taskPage";
import CoursePage from "./pages/coursePage";
import UserPage from "./pages/userPage";

export const AppRouters = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <MainPage />,
      },
      { path: "/user", element: <UserPage /> },
      { path: "/task/:id", element: <TaskPage /> },
      { path: "/course/:nameEN", element: <CoursePage /> },
    ],
  },
]);
