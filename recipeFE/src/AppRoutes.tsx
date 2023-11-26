import { Home } from "./pages/home/HomePage.tsx";
import { IngredientPage } from "./pages/ingredient/IngredientPage.tsx";
import { CategoryPage } from "./pages/category/CategoryPage.tsx";
import {
  Navigate,
  Route,
  RouteProps,
  Routes,
  useLocation,
} from "react-router-dom";
import { RecipePage } from "./pages/recipe/RecipePage.tsx";
import { SearchPage } from "./pages/search/SearchPage.tsx";

export type RouteConfig = RouteProps & {
  /**
   * Required route path.   * E.g. /home   */
  path: string;
};

//Registering the routes in routes array
export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/ingredient",
    element: <IngredientPage />,
  },
  {
    path: "/category",
    element: <CategoryPage />,
  },
  {
    path: "/recipe/:id",
    element: <RecipePage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
];

//Function that renders a rout based on the infos from the rout inside routes array
const renderRouteMap = (route: RouteConfig) => {
  return <Route key={route.path} {...route} />;
};

//Routs component
export const AppRoutes = () => {
  return <Routes>{routes.map(renderRouteMap)}</Routes>; //for each rout in routes render the rout using renderRouteMap
};
