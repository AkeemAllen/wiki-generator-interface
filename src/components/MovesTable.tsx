import {
  Autocomplete,
  Box,
  Button,
  Modal,
  NativeSelect,
  NumberInput,
  SimpleGrid,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useFetch } from "usehooks-ts";
import { Move } from "../types";

type MovesTableProps = {
  moves: Move;
  setMoves: any;
};

type NewMove = {
  move_name: string;
  level_learned_at: number;
  learn_method: string;
};

const MovesTable = ({ moves, setMoves }: MovesTableProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [
    editMoveModalOpened,
    { open: openEditMoveModal, close: closeEditMoveModal },
  ] = useDisclosure(false);
  const [moveToEdit, setMoveToEdit] = useState<string>("");
  const [newMove, setNewMove] = useState<NewMove>({
    move_name: "",
    level_learned_at: 0,
    learn_method: "machine",
  } as NewMove);
  const [searchTerm, setSearchTerm] = useInputState<string>("");
  const { data: moveList, error: moveListError } = useFetch<string[]>(
    "http://localhost:8081/moves"
  );

  const handleMethodMoveChange = (method: string, move_name: string) => {
    setMoves((moves: Move) => {
      return {
        ...moves,
        [move_name]: {
          ...moves[move_name],
          learn_method: method,
        },
      };
    });
  };

  const handleLevelMoveChange = (level: number, move_name: string) => {
    setMoves((moves: Move) => {
      return {
        ...moves,
        [move_name]: {
          ...moves[move_name],
          level_learned_at: level,
        },
      };
    });
  };

  const addNewMove = (move_name: string) => {
    setMoves((moves: Move) => {
      return {
        [move_name]: {
          level_learned_at: newMove.level_learned_at,
          learn_method: newMove.learn_method,
        },
        ...moves,
      };
    });
    close();
    setNewMove({
      move_name: "",
      level_learned_at: 0,
      learn_method: "machine",
    } as NewMove);
  };

  const deleteMove = (move_name: string) => {
    setMoves((moves: Move) => {
      return {
        ...moves,
        [move_name]: {
          ...moves[move_name],
          delete: true,
        },
      };
    });
  };

  return (
    <>
      <SimpleGrid cols={3} mt="50px">
        <Title order={2}>Moves</Title>
        <TextInput
          icon={<IconSearch size={"1rem"} />}
          placeholder="Search Moves"
          onChange={setSearchTerm}
        />
        <Box w={200}>
          <Button leftIcon={<IconPlus size={"1rem"} />} onClick={open}>
            Add Move
          </Button>
        </Box>
      </SimpleGrid>
      <Table withBorder mt="lg">
        <thead>
          <tr>
            <th>
              <Title order={4}>Move</Title>
            </th>
            <th>
              <Title order={4}>Learn Method</Title>
            </th>
            <th>
              <Title order={4}>Learn level</Title>
            </th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {Object.keys(moves)
            .filter((key: string) => moves[key].delete !== true)
            .filter((key: string) => key.includes(searchTerm))
            .map((key: string, index: number) => {
              return (
                <tr key={index}>
                  <td>{key}</td>
                  <td>{moves[key].learn_method}</td>
                  <td>{moves[key].level_learned_at}</td>
                  <td>
                    <Button
                      leftIcon={<IconTrash size={"1rem"} />}
                      onClick={() => deleteMove(key)}
                    >
                      Delete
                    </Button>
                  </td>
                  <td>
                    <Button
                      leftIcon={<IconEdit size={"1rem"} />}
                      onClick={() => {
                        openEditMoveModal();
                        setMoveToEdit(key);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <Modal opened={opened} onClose={close} title={"Add New Move"} centered>
        <Autocomplete
          value={newMove.move_name}
          onChange={(value) => setNewMove({ ...newMove, move_name: value })}
          data={moveList === undefined ? [] : moveList}
          label="New Move"
        />
        <NativeSelect
          mt="lg"
          mb="lg"
          label="Learn Method"
          defaultValue={newMove.learn_method}
          onChange={(e) =>
            setNewMove({ ...newMove, learn_method: e.target.value })
          }
          data={["level-up", "machine", "egg", "tutor"]}
        />
        {newMove.learn_method === "level-up" && (
          <NumberInput
            mb="lg"
            label="Level"
            value={newMove.level_learned_at}
            onChange={(e: number) =>
              setNewMove({ ...newMove, level_learned_at: e })
            }
          />
        )}
        <Button onClick={() => addNewMove(newMove.move_name)}>Save</Button>
      </Modal>
      <Modal
        opened={editMoveModalOpened}
        onClose={closeEditMoveModal}
        title={"Edit Move"}
        centered
      >
        <TextInput value={moveToEdit} disabled label="Move Name" />
        <NativeSelect
          mt="lg"
          mb="lg"
          label="Learn Method"
          value={moves[moveToEdit]?.learn_method}
          onChange={(e) => handleMethodMoveChange(e.target.value, moveToEdit)}
          data={["level-up", "machine", "egg", "tutor"]}
        />
        {moves[moveToEdit]?.learn_method === "level-up" && (
          <NumberInput
            mb="lg"
            label="Level"
            value={moves[moveToEdit]?.level_learned_at}
            onChange={(e: number) => handleLevelMoveChange(e, moveToEdit)}
          />
        )}
        <Button onClick={closeEditMoveModal}>Close</Button>
      </Modal>
    </>
  );
};

export default MovesTable;
