import {
  AppShell,
  Burger,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
  Text,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  IconBallBasketball,
  IconDisc,
  IconGitBranch,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { useGetMoves } from "./apis/movesApis";
import { useGetPokemon } from "./apis/pokemonApis";
import { useGetRoutes } from "./apis/routesApis";
import NavButton from "./components/NavButton";
import { useMovesStore, usePokemonStore, useRouteStore } from "./stores";

function App() {
  const setPokemonList = usePokemonStore((state) => state.setPokemonList);
  const setMovesList = useMovesStore((state) => state.setMovesList);
  const setRoutes = useRouteStore((state) => state.setRoutes);
  const { pathname } = useLocation();

  const [navBarOpened, setNavBarOpened] = useState(false);

  useGetPokemon((data: any) => setPokemonList(data));

  useGetMoves((data: any) => setMovesList(data));

  useGetRoutes((data: any) => setRoutes(data));

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
      <AppShell
        header={
          <Header height={{ base: 70 }} p="xl">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={navBarOpened}
                onClick={() => setNavBarOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </MediaQuery>
            <Text>Wiki Generator Interface</Text>
          </Header>
        }
        navbarOffsetBreakpoint="sm"
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!navBarOpened}
            width={{ sm: 200, lg: 300 }}
          >
            <Link to={"/pokemon"} style={{ textDecoration: "none" }}>
              <NavButton
                text="Pokemon"
                color="blue"
                isActive={pathname === "/pokemon"}
                icon={<IconBallBasketball size={"1rem"} />}
              />
            </Link>

            <Link to={"/moves"} style={{ textDecoration: "none" }}>
              <NavButton
                text="Moves"
                color="teal"
                isActive={pathname.includes("/moves")}
                icon={<IconDisc size={"1rem"} />}
              />
            </Link>

            <Link to={"/game-routes"} style={{ textDecoration: "none" }}>
              <NavButton
                text="GameRoutes"
                color="yellow"
                isActive={pathname.includes("/game-routes")}
                icon={<IconGitBranch size={"1rem"} />}
              />
            </Link>
          </Navbar>
        }
      >
        <Outlet />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
