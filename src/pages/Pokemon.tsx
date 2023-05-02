import { Autocomplete, Button, Grid } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import {
  useGetPokemonByName,
  useSavePokemonChanges,
} from "../apis/pokemonApis";
import PokemonModificationView from "../components/PokemonModificationView";
import { usePokemonStore } from "../stores";
import { PokemonChanges, PokemonData } from "../types";
import { isNullEmptyOrUndefined } from "../utils";

const Pokemon = () => {
  const [pokemonName, setPokemonName] = useState<string>("");
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [pokemonChanges, setPokemonChanges] = useState<PokemonChanges | null>(
    null
  );
  const pokemonList = usePokemonStore((state) => state.pokemonList);

  const { refetch, isLoading } = useGetPokemonByName({
    pokemonName,
    onSuccess: (data: any) => setPokemonData(data),
  });

  const { mutate: mutatePokemon } = useSavePokemonChanges({
    pokemonName,
    pokemonChanges: pokemonChanges as PokemonChanges,
    onSuccess: () => {
      notifications.show({ message: "Changes Saved" });
      setPokemonChanges(null);
    },
    onError: () => {
      notifications.show({ message: "Error Saving changes", color: "red" });
    },
  });

  const handleSearch = () => {
    setPokemonData(null);
    refetch();
  };

  const saveChanges = () => {
    mutatePokemon();
  };

  return (
    <>
      <Grid>
        <Grid.Col span={6}>
          <Autocomplete
            placeholder="Pokemon Name"
            onChange={(value) => setPokemonName(value)}
            data={
              pokemonList === undefined ? [] : pokemonList.map((p) => p.name)
            }
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Button
            fullWidth
            onClick={handleSearch}
            disabled={isNullEmptyOrUndefined(pokemonName)}
          >
            Search
          </Button>
        </Grid.Col>
        <Grid.Col span={3}>
          <Button
            fullWidth
            disabled={pokemonChanges === null}
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </Grid.Col>
      </Grid>
      {!isLoading && pokemonData && (
        <PokemonModificationView
          pokemonData={pokemonData}
          setPokemonChanges={setPokemonChanges}
          pokemonChanges={pokemonChanges}
        />
      )}
    </>
  );
};

export default Pokemon;
