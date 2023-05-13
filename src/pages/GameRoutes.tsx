import { Button, Grid, Modal, NumberInput, TextInput } from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAddNewRoute, useUpdateRoutePosition } from "../apis/routesApis";
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

const Routes = () => {
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
              <Link to={`${routeName}`} style={{ textDecoration: "none" }}>
                <Button fullWidth>{routeName}</Button>
              </Link>
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
          onClick={() => updateRoutePosition({ routeNameToEdit, newPosition })}
        >
          Save Changes
        </Button>
      </Modal>
    </>
  );
};

export default Routes;
