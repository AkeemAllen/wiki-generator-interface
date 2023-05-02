import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  createStyles,
  Grid,
  Modal,
  NumberInput,
  rem,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import {
  useAddNewRoute,
  useDeleteRoute,
  useEditRouteName,
  useUpdateRoutePosition,
} from "../apis/routesApis";
import WildEncountersModal from "../components/RouteModals/WildEncountersModal";
import { useRouteStore } from "../stores";

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
      // position: "absolute",
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

type RouteNameModalProps = {
  isOpen: boolean;
  close: () => void;
  saveFunction: () => void;
  routeName: string;
  setRouteName: any;
};

const RouteNameModal = ({
  isOpen,
  close,
  saveFunction,
  routeName,
  setRouteName,
}: RouteNameModalProps) => {
  return (
    <Modal opened={isOpen} withCloseButton={false} onClose={close}>
      <TextInput label="Route Name" value={routeName} onChange={setRouteName} />
      <Button onClick={saveFunction} mt={20}>
        Save Route
      </Button>
    </Modal>
  );
};

const Routes = () => {
  const { classes } = useStyles();
  const [newRouteName, setNewRouteName] = useInputState<string>("");
  const [currentRoute, setCurrentRoute] = useState<string>("");
  const [newPosition, setNewPosition] = useState<number>(0);
  const [
    newRouteNameModalOpen,
    { open: openNewRouteNameModal, close: closeNewRouteNameModal },
  ] = useDisclosure(false);
  const [
    editRouteNameModalOpen,
    { open: openEditRouteNameModal, close: closeEditRouteNameModal },
  ] = useDisclosure(false);
  const [routeNameToEdit, setRouteNameToEdit] = useState("");
  const [
    wildEncountersModalOpen,
    { open: openWildEncountersModal, close: closeWildEncountersModal },
  ] = useDisclosure(false);
  const [
    editPositionModalOpen,
    { open: openEditPositionModal, close: closeEditPositionModal },
  ] = useDisclosure(false);

  const setRoutes = useRouteStore((state) => state.setRoutes);
  const routes = useRouteStore((state) => state.routes);

  const { mutate: addNewRoute } = useAddNewRoute((data) => {
    setRoutes(data.routes);
    setNewRouteName("");
    notifications.show({ message: "Route added successfully!" });
    closeNewRouteNameModal();
  });

  const { mutate: deleteRoute } = useDeleteRoute((data) => {
    setRoutes(data.routes);
    notifications.show({
      message: "Route deleted successfully!",
      color: "red",
    });
  });

  const { mutate: editRouteName } = useEditRouteName((data) => {
    setRoutes(data.routes);
    setNewRouteName("");
    notifications.show({ message: "Route name changed successfully!" });
    closeEditRouteNameModal();
  });

  const { mutate: updateRoutePosition } = useUpdateRoutePosition((data) => {
    setRoutes(data.routes);
    setNewPosition(0);
    closeEditPositionModal();
    notifications.show({
      message: "Route position changed successfully!",
      color: "red",
    });
  });

  return (
    <>
      <Button leftIcon={<IconPlus />} onClick={openNewRouteNameModal}>
        Add Route
      </Button>
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
                    <Grid mt={5}>
                      <Grid.Col span={2}>
                        <ActionIcon
                          onClick={() => {
                            openEditRouteNameModal();
                            setRouteNameToEdit(routeName);
                          }}
                        >
                          <IconEdit />
                        </ActionIcon>
                      </Grid.Col>
                      <Grid.Col span={2}>
                        <ActionIcon onClick={() => deleteRoute(routeName)}>
                          <IconTrash />
                        </ActionIcon>
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Tooltip label={"Click to edit position"}>
                          <ActionIcon
                            onClick={() => {
                              openEditPositionModal();
                              setRouteNameToEdit(routeName);
                            }}
                          >
                            {routes[routeName].position}
                          </ActionIcon>
                        </Tooltip>
                      </Grid.Col>
                    </Grid>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Grid.Col>
          );
        })}
      </Grid>
      <RouteNameModal
        isOpen={newRouteNameModalOpen}
        close={closeNewRouteNameModal}
        saveFunction={() => addNewRoute(newRouteName)}
        routeName={newRouteName}
        setRouteName={setNewRouteName}
      />
      <RouteNameModal
        isOpen={editRouteNameModalOpen}
        close={closeEditRouteNameModal}
        saveFunction={() => editRouteName({ routeNameToEdit, newRouteName })}
        routeName={newRouteName}
        setRouteName={setNewRouteName}
      />
      <Modal
        opened={editPositionModalOpen}
        onClose={closeEditPositionModal}
        withCloseButton={false}
      >
        <NumberInput
          label="New Position"
          value={newPosition}
          onChange={(e: number) => setNewPosition(e)}
        />
        <Button
          onClick={() => updateRoutePosition({ routeNameToEdit, newPosition })}
        >
          Save Changes
        </Button>
      </Modal>
      <WildEncountersModal
        opened={wildEncountersModalOpen}
        close={closeWildEncountersModal}
        routeName={currentRoute}
      />
    </>
  );
};

export default Routes;
