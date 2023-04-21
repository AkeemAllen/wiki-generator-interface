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
import { useState } from "react";
import SnackBarProvider from "react-simple-snackbar";
import { useFetch, useUpdateEffect } from "usehooks-ts";
import "./App.css";
import NavButton from "./components/NavButton";
import Moves from "./pages/Moves";
import Pokemon from "./pages/Pokemon";
import Routes from "./pages/Routes";
import { useMovesStore, usePokemonStore } from "./store";

function App() {
  const [navBarOpened, setNavBarOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState("pokemon");
  const setPokemonList = usePokemonStore((state) => state.setPokemonList);
  const setMovesList = useMovesStore((state) => state.setMovesList);

  const { data } = useFetch<string[]>(
    `${import.meta.env.VITE_BASE_URL}/pokemon`
  );

  const { data: moves } = useFetch<string[]>(
    `${import.meta.env.VITE_BASE_URL}/moves`
  );

  useUpdateEffect(() => {
    if (data) {
      setPokemonList(data);
    }
  }, [data]);

  useUpdateEffect(() => {
    if (moves) {
      setMovesList(moves);
    }
  }, [moves]);

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
