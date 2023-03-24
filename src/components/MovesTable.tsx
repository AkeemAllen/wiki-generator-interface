import {
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
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Move } from "../types";

type MovesTableProps = {
  moves: Move;
  setMoves: any;
};

const MovesTable = ({ moves, setMoves }: MovesTableProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [newMove, setNewMove] = useInputState<string>("");

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
        ...moves,
        [move_name]: {
          level_learned_at: 1,
          learn_method: "level-up",
        },
      };
    });
    close();
    setNewMove("");
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
      <SimpleGrid cols={2} mt="50px">
        <Title order={2}>Moves</Title>
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
          </tr>
        </thead>
        <tbody>
          {Object.keys(moves)
            .filter((key: string) => moves[key].delete !== true)
            .map((key: string, index: number) => {
              return (
                <tr key={index}>
                  <td>{key}</td>
                  <td>
                    <NativeSelect
                      defaultValue={moves[key].learn_method}
                      onChange={(e) =>
                        handleMethodMoveChange(e.target.value, key)
                      }
                      data={["level-up", "machine", "egg", "tutor"]}
                    />
                  </td>
                  <td>
                    <NumberInput
                      defaultValue={moves[key].level_learned_at}
                      min={0}
                      max={100}
                      onChange={(e: number) => handleLevelMoveChange(e, key)}
                    />
                  </td>
                  <td>
                    <Button
                      leftIcon={<IconTrash size={"1rem"} />}
                      onClick={() => deleteMove(key)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <Modal opened={opened} onClose={close} title={"New Move"} centered>
        <TextInput onChange={setNewMove} />
        <Button onClick={() => addNewMove(newMove)}>Save</Button>
      </Modal>
    </>
  );
};

export default MovesTable;
