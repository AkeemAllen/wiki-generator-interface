import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Routes } from "../types";

type RouteStoreState = {
  routes: Routes;
};

type RouteStoreAction = {
  setRoutes: (routes: RouteStoreState["routes"]) => void;
};

export const useRouteStore = create<RouteStoreState & RouteStoreAction>(
  devtools((set) => ({
    routes: {},
    setRoutes: (routes) => set(() => ({ routes })),
  }))
);
