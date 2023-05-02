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
import SnackBarProvider from "react-simple-snackbar";
import "./App.css";
import { useGetMoves } from "./apis/movesApis";
import { useGetPokemon } from "./apis/pokemonApis";
import { useGetRoutes } from "./apis/routesApis";
import NavButton from "./components/NavButton";
import Moves from "./pages/Moves";
import Pokemon from "./pages/Pokemon";
import Routes from "./pages/Routes";
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
    <SnackBarProvider>
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
              <NavButton
                text="Pokemon"
                color="blue"
                icon={<IconBallBasketball size={"1rem"} />}
                onClick={() => setCurrentPage("pokemon")}
              />

              <NavButton
                text="Moves"
                color="teal"
                icon={<IconDisc size={"1rem"} />}
                onClick={() => setCurrentPage("moves")}
              />

              <NavButton
                text="Routes"
                color="yellow"
                icon={<IconGitBranch size={"1rem"} />}
                onClick={() => setCurrentPage("routes")}
              />
            </Navbar>
          }
        >
          {currentPage === "pokemon" && <Pokemon />}
          {currentPage === "moves" && <Moves />}
          {currentPage === "routes" && <Routes />}
        </AppShell>
      </MantineProvider>
    </SnackBarProvider>
  );
}

export default App;
