import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Menu,
  Modal,
  TextInput,
  Title,
  createStyles,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import {
  useAddNewRoute,
  useDeleteRoute,
  useDuplicateRoute,
} from "../apis/routesApis";
import OrganizeRoutesModal from "../components/OrganizeRoutesModal";
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
    marginBottom: theme.spacing.md,
  },
}));

const Routes = () => {
  const { classes } = useStyles();
  const [newRouteName, setNewRouteName] = useInputState<string>("");
  const [
    newRouteNameModalOpen,
    { open: openNewRouteNameModal, close: closeNewRouteNameModal },
  ] = useDisclosure(false);
  const [
    organizeRouteModalOpen,
    { open: openOrganizeRoutesModal, close: closeOrganizeRoutesModal },
  ] = useDisclosure(false);
  const navigate = useNavigate();

  const routes = useRouteStore((state) => state.routes);
  const setRoutes = useRouteStore((state) => state.setRoutes);

  const { mutate: addNewRoute } = useAddNewRoute((data) => {
    setRoutes(data.routes);
    setNewRouteName("");
    notifications.show({ message: "Route added successfully!" });
    closeNewRouteNameModal();
    navigate(`${newRouteName}`);
  });

  const { mutate: deleteRoute } = useDeleteRoute((data) => {
    setRoutes(data.routes);
    notifications.show({
      message: "Route deleted successfully!",
      color: "red",
    });
  });

  const { mutate: duplicateRoute } = useDuplicateRoute((data) => {
    setRoutes(data.routes);
    notifications.show({
      message: "Route duplicated successfully!",
    });
  });

  return (
    <>
      <Grid>
        <Grid.Col span={2}>
          <Button leftIcon={<IconPlus />} onClick={openNewRouteNameModal}>
            Add Route
          </Button>
        </Grid.Col>
        <Grid.Col span={2} onClick={openOrganizeRoutesModal}>
          <Button>Organize Routes</Button>
        </Grid.Col>
      </Grid>
      <Grid mt={50} className="draggable-list">
        {Object.keys(routes).map((routeName, index) => {
          return (
            <Grid.Col key={index} span={3} className="draggable-source">
              <Box className={classes.box}>
                <Grid sx={{ alignItems: "center" }}>
                  <Grid.Col
                    span={10}
                    onClick={() => navigate(`${routeName}`)}
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <Title order={5}>{routeName}</Title>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Menu shadow="sm" width={200}>
                      <Menu.Target>
                        <ActionIcon color="gray">
                          <IconDotsVertical />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          onClick={() =>
                            duplicateRoute({
                              routeName,
                              newRouteName: `${routeName} copy`,
                            })
                          }
                        >
                          Duplicate
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          onClick={() => deleteRoute(routeName)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
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
        opened={organizeRouteModalOpen}
        withCloseButton={false}
        onClose={closeOrganizeRoutesModal}
        size={500}
      >
        <OrganizeRoutesModal />
      </Modal>
    </>
  );
};

export default Routes;
