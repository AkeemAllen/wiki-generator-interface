import {
  AppShell,
  Burger,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
  Text,
} from "@mantine/core";
import { IconBallBasketball, IconDisc } from "@tabler/icons-react";
import { useState } from "react";
import SnackBarProvider from "react-simple-snackbar";
import "./App.css";
import NavButton from "./components/NavButton";
import Moves from "./pages/Moves";
import Pokemon from "./pages/Pokemon";

function App() {
  const [navBarOpened, setNavBarOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState("pokemon");

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
            </Navbar>
          }
        >
          {currentPage === "pokemon" && <Pokemon />}
          {currentPage === "moves" && <Moves />}
        </AppShell>
      </MantineProvider>
    </SnackBarProvider>
  );
}

export default App;
