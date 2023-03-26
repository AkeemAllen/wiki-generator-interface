import {
  Button,
  Grid,
  NativeSelect,
  NumberInput,
  SimpleGrid,
  TextInput,
  Title,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { Types } from "../constants";
import { MoveDetails } from "../types";

const Moves = () => {
  const [moveName, setMoveName] = useInputState<string>("");
  const [moveDetails, setMoveDetails] = useInputState<MoveDetails | null>(null);

  const handleSearch = () => {
    fetch(`http://localhost:8081/moves/${moveName}`).then((res) => {
      res.json().then((data) => {
        setMoveDetails(data);
      });
    });
  };

  const saveChanges = () => {
    fetch(`http://localhost:8081/save-changes/moves/${moveName}`, {
      method: "POST",
      body: JSON.stringify(moveDetails),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleMoveDetailChanges = (e: any, detail: string) => {
    setMoveDetails((moveDetails: MoveDetails) => {
      return {
        ...moveDetails,
        [detail]: e,
      };
    });
  };

  return (
    <>
      <Grid>
        <Grid.Col span={6}>
          <TextInput placeholder="Move Name" onChange={setMoveName} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Button fullWidth onClick={handleSearch}>
            Search
          </Button>
        </Grid.Col>
        <Grid.Col span={3}>
          <Button
            fullWidth
            // disabled={pokemonChanges === null}
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </Grid.Col>
      </Grid>
      {moveDetails && (
        <>
          <Title order={2} mt="lg">
            {moveName}
          </Title>
          <SimpleGrid cols={2}>
            <NumberInput
              label="Power"
              value={moveDetails.power}
              onChange={(e: number) => handleMoveDetailChanges(e, "power")}
            />
            <NativeSelect
              label="Type"
              value={moveDetails.type}
              onChange={(e) => handleMoveDetailChanges(e.target.value, "type")}
              data={Object.keys(Types).map((key: string) => Types[key])}
            />
            <NumberInput
              label="Accuracy"
              value={moveDetails.accuracy}
              onChange={(e: number) => handleMoveDetailChanges(e, "accuracy")}
            />
            <NumberInput
              label="PP"
              value={moveDetails.pp}
              onChange={(e: number) => handleMoveDetailChanges(e, "pp")}
            />
            <NativeSelect
              label="Damage Class"
              value={moveDetails.damage_class}
              onChange={(e) =>
                handleMoveDetailChanges(e.target.value, "damage_class")
              }
              data={["physical", "special", "status"]}
            />
          </SimpleGrid>
        </>
      )}
    </>
  );
};

export default Moves;
