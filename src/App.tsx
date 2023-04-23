import {
  AppShell,
  Burger,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
  Text,
} from "@mantine/core";
import {
  IconBallBasketball,
  IconDisc,
  IconGitBranch,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SnackBarProvider from "react-simple-snackbar";
import "./App.css";
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

  // find out if there is a better way to do this
  // since the data is not being used anywhere else
  const { data: pokemon } = useQuery({
    queryKey: ["pokemon"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}/pokemon`).then((res) =>
        res.json()
      ),
    onSuccess: (data) => {
      setPokemonList(data);
    },
  });

  const { data: moves } = useQuery({
    queryKey: ["moves"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}/moves`).then((res) => res.json()),
    onSuccess: (data) => {
      setMovesList(data);
    },
  });

  const { data: routes } = useQuery({
    queryKey: ["routes"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}/game_routes`).then((res) =>
        res.json()
      ),
    onSuccess: (data) => {
      setRoutes(data);
    },
  });

  return (
    <SnackBarProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
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
