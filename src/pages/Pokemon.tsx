import { Autocomplete, Button, Grid } from "@mantine/core";
import { useState } from "react";
import { useSnackbar } from "react-simple-snackbar";
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
  const [openSnackbar] = useSnackbar({
    position: "bottom-center",
  });

  const handleSearch = () => {
    // ideally this should utilize isLoading, data and error states
    // to help rerender the PokemonModifier component
    // but for now settting pokemonData to null will do
    setPokemonData(null);
    fetch(`${import.meta.env.VITE_BASE_URL}/pokemon/${pokemonName}`).then(
      (res) => {
        res.json().then((data) => {
          if (data.status === 404) {
            alert(`${pokemonName} not found`);
            return;
          }
          setPokemonData(data);
        });
      }
    );
  };

  const saveChanges = () => {
    fetch(
      `${import.meta.env.VITE_BASE_URL}/save-changes/pokemon/${pokemonName}`,
      {
        method: "POST",
        body: JSON.stringify(pokemonChanges),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          openSnackbar("Changes saved successfully");
          setPokemonChanges(null);
        } else {
          openSnackbar("Error saving changes");
        }
      })
      .catch((err) => console.log(err));
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
      {pokemonData && (
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
