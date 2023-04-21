import { Box, Button, Card, Grid, Modal, TextInput } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import WildEncountersModal from "../components/RouteModals/WildEncountersModal";
import { usePokemonStore } from "../store";
import { Encounters, Routes } from "../types";

const Routes = () => {
  const [routes, setRoutes] = useState<Routes>({} as Routes);
  const [newRouteName, setNewRouteName] = useInputState<string>("");
  const [currentRoute, setCurrentRoute] = useState<string>("");
  const [
    newRouteNameModalOpen,
    { open: openNewRouteNameModal, close: closeNewRouteNameModal },
  ] = useDisclosure(false);
  const [
    wildEncountersModalOpen,
    { open: openWildEncountersModal, close: closeWildEncountersModal },
  ] = useDisclosure(false);

  const pokemonList = usePokemonStore((state) => state.pokemonList);

  const handleRouteUpdates = () => {};
  const addRoute = () => {
    setRoutes((routes: Routes) => {
      return {
        ...routes,
        [newRouteName]: {},
      };
    });
    setNewRouteName("");
    closeNewRouteNameModal();
  };

  return (
    <>
      <Grid>
        <Grid.Col>
          <Button leftIcon={<IconPlus />} onClick={openNewRouteNameModal}>
            Add Route
          </Button>
        </Grid.Col>
      </Grid>
      <Grid mt={50}>
        {Object.keys(routes).map((routeName, index) => {
          return (
            <Grid.Col key={index} span={3}>
              <Card withBorder radius="md">
                {routeName}
                <Box
                  sx={{ borderRadius: 4, ":hover": { cursor: "pointer" } }}
                  p={10}
                  mt={20}
                  bg={"#e7f5ff"}
                  onClick={() => {
                    setCurrentRoute(routeName);
                    openWildEncountersModal();
                  }}
                >
                  Wild Encounters
                </Box>
                <Box sx={{ borderRadius: 4 }} p={10} mt={20} bg={"#e7f5ff"}>
                  Trainers
                </Box>
                <Box sx={{ borderRadius: 4 }} p={10} mt={20} bg={"#e7f5ff"}>
                  Important Trainers
                </Box>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
      <Modal
        opened={newRouteNameModalOpen}
        withCloseButton={false}
        onClose={closeNewRouteNameModal}
      >
        <TextInput
          label="Route Name"
          value={newRouteName}
          onChange={setNewRouteName}
        />
        <Button onClick={addRoute} mt={20}>
          Save Route
        </Button>
      </Modal>
      <WildEncountersModal
        opened={wildEncountersModalOpen}
        close={closeWildEncountersModal}
        routeName={currentRoute}
        wildEncounters={
          routes[currentRoute]?.wild_encounters || ({} as Encounters)
        }
        setRoutes={setRoutes}
      />
    </>
  );
};

export default Routes;
