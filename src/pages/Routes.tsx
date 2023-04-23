import {
  Accordion,
  Box,
  Button,
  createStyles,
  Grid,
  Modal,
  rem,
  TextInput,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import WildEncountersModal from "../components/RouteModals/WildEncountersModal";
import { useRouteStore } from "../stores";
import { Encounters } from "../types";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    borderRadius: theme.radius.sm,
  },
  item: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    border: `${rem(1)} solid transparent`,
    position: "relative",
    zIndex: 0,
    transition: "transform 150ms ease",

    "&[data-active]": {
      transform: "scale(1.03)",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      boxShadow: theme.shadows.md,
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2],
      borderRadius: theme.radius.md,
      zIndex: 1,
    },
  },
  box: {
    borderRadius: 4,
    color: theme.colors.blue[7],
    backgroundColor: theme.colors.blue[0],
    marginTop: 5,
    ":hover": {
      cursor: "pointer",
      backgroundColor: theme.colors.blue[1],
      transform: "scale(1.03)",
      transition: "background-color 0.2s ease",
    },
    transition: "background-color 0.2s ease",
  },
}));

const Routes = () => {
  const { classes } = useStyles();
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
  const setRoutes = useRouteStore((state) => state.setRoutes);
  const routes = useRouteStore((state) => state.routes);

  const addRoute = () => {
    let data = {
      ...routes,
      [newRouteName]: {},
    };
    setRoutes(data);
    setNewRouteName("");
    closeNewRouteNameModal();
  };

  return (
    <>
      <Grid>
        <Grid.Col span={2}>
          <Button leftIcon={<IconPlus />} onClick={openNewRouteNameModal}>
            Add Route
          </Button>
        </Grid.Col>
        <Grid.Col span={2}>
          <Button>Save Changes</Button>
        </Grid.Col>
      </Grid>
      <Grid mt={50}>
        {Object.keys(routes).map((routeName, index) => {
          return (
            <Grid.Col key={index} span={3}>
              <Accordion
                maw={420}
                mx="auto"
                variant="filled"
                defaultValue="customization"
                classNames={classes}
                className={classes.root}
              >
                <Accordion.Item value={routeName}>
                  <Accordion.Control>{routeName}</Accordion.Control>
                  <Accordion.Panel>
                    <Box
                      className={classes.box}
                      p={10}
                      onClick={() => {
                        setCurrentRoute(routeName);
                        openWildEncountersModal();
                      }}
                    >
                      Wild Encounters
                    </Box>
                    <Box
                      className={classes.box}
                      sx={{ borderRadius: 4 }}
                      p={10}
                    >
                      Trainers
                    </Box>
                    <Box
                      className={classes.box}
                      sx={{ borderRadius: 4 }}
                      p={10}
                    >
                      Important Trainers
                    </Box>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
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
      />
    </>
  );
};

export default Routes;
