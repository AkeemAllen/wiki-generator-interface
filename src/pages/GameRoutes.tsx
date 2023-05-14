import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Modal,
  NumberInput,
  TextInput,
  Title,
  createStyles,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconExternalLink, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAddNewRoute,
  useDeleteRoute,
  useUpdateRoutePosition,
} from "../apis/routesApis";
import { useRouteStore } from "../stores";

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

const useStyles = createStyles((theme) => ({
  box: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    boxShadow: theme.shadows.sm,
    border: `1px solid`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
}));

const Routes = () => {
  const { classes } = useStyles();
  const [newRouteName, setNewRouteName] = useInputState<string>("");
  const [newPosition, setNewPosition] = useState<number>(0);
  const [
    newRouteNameModalOpen,
    { open: openNewRouteNameModal, close: closeNewRouteNameModal },
  ] = useDisclosure(false);
  const [routeNameToEdit, setRouteNameToEdit] = useState("");
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

  const { mutate: updateRoutePosition } = useUpdateRoutePosition((data) => {
    setRoutes(data.routes);
    setNewPosition(0);
    closeEditPositionModal();
    notifications.show({
      message: "Route position changed successfully!",
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
            <Grid.Col key={index} span={4}>
              <Box className={classes.box}>
                <Grid columns={25} sx={{ alignItems: "center" }}>
                  <Grid.Col span={12}>
                    <Title order={5}>{routeName}</Title>
                  </Grid.Col>
                  <Grid.Col span={3} offset={3}>
                    <Link
                      to={`${routeName}`}
                      style={{ textDecoration: "none" }}
                    >
                      <ActionIcon color="gray">
                        <IconExternalLink />
                      </ActionIcon>
                    </Link>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <ActionIcon color="gray">
                      <IconTrash onClick={() => deleteRoute(routeName)} />
                    </ActionIcon>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Button
                      variant="light"
                      color="gray"
                      onClick={() => {
                        setRouteNameToEdit(routeName);
                        openEditPositionModal();
                      }}
                    >
                      {routes[routeName].position}
                    </Button>
                  </Grid.Col>
                </Grid>
              </Box>
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
          mt={20}
          onClick={() => updateRoutePosition({ routeNameToEdit, newPosition })}
        >
          Save Position
        </Button>
      </Modal>
    </>
  );
};

export default Routes;
