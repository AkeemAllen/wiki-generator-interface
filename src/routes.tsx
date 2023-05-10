import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import GameRoutes from "./pages/GameRoutes";
import GameRoutesDetails, {
  loader as routeLoader,
} from "./pages/GameRoutesDetails";
import Moves from "./pages/Moves";
import Pokemon from "./pages/Pokemon";
import ErrorPage from "./pages/error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "pokemon",
        element: <Pokemon />,
      },
      {
        path: "moves",
        element: <Moves />,
      },
      {
        path: "game-routes",
        element: <GameRoutes />,
      },
      {
        path: "game-routes/:routeName",
        element: <GameRoutesDetails />,
        loader: routeLoader,
      },
    ],
  },
]);

export { router };
