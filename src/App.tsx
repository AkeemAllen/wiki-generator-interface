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
import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { useGetMoves } from "./apis/movesApis";
import { useGetPokemon } from "./apis/pokemonApis";
import { useGetRoutes } from "./apis/routesApis";
import NavButton from "./components/NavButton";
// import Routes from "./pages/GameRoutes";
// import Moves from "./pages/Moves";
// import Pokemon from "./pages/Pokemon";
import { useMovesStore, usePokemonStore, useRouteStore } from "./stores";

function App() {
  const [navBarOpened, setNavBarOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState("pokemon");
  const setPokemonList = usePokemonStore((state) => state.setPokemonList);
  const setMovesList = useMovesStore((state) => state.setMovesList);
  const setRoutes = useRouteStore((state) => state.setRoutes);

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
                isActive={currentPage === "pokemon"}
                icon={<IconBallBasketball size={"1rem"} />}
                onClick={() => setCurrentPage("pokemon")}
              />
            </Link>

            <Link to={"/moves"} style={{ textDecoration: "none" }}>
              <NavButton
                text="Moves"
                color="teal"
                isActive={currentPage === "moves"}
                icon={<IconDisc size={"1rem"} />}
                onClick={() => setCurrentPage("moves")}
              />
            </Link>

            <Link to={"/game-routes"} style={{ textDecoration: "none" }}>
              <NavButton
                text="GameRoutes"
                color="yellow"
                isActive={currentPage === "game-routes"}
                icon={<IconGitBranch size={"1rem"} />}
                onClick={() => setCurrentPage("game-routes")}
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
