import { Button, Grid, TextInput } from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useState } from "react";
import { useSnackbar } from "react-simple-snackbar";
import PokemonModifier from "../components/PokemonModifier";
import { PokemonChanges, PokemonData } from "../types";

const Pokemon = () => {
  const [pokemonName, setPokemonName] = useInputState<string>("");
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [pokemonChanges, setPokemonChanges] = useState<PokemonChanges | null>(
    null
  );
  const [openSnackbar, closeSnackbar] = useSnackbar({
    position: "bottom-center",
  });

  const handleSearch = () => {
    fetch(`http://localhost:8081/pokemon/${pokemonName}`).then((res) => {
      res.json().then((data) => {
        if (data.status === 404) {
          alert(`${pokemonName} not found`);
          return;
        }
        setPokemonData(data);
      });
    });
  };

  const saveChanges = () => {
    console.log(pokemonChanges);
    fetch(`http://localhost:8081/save-changes/pokemon/${pokemonName}`, {
      method: "POST",
      body: JSON.stringify(pokemonChanges),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.status === 200) {
          openSnackbar("Changes saved successfully");
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
          <TextInput placeholder="Pokemon Name" onChange={setPokemonName} />
        </Grid.Col>
        <Grid.Col span={3}>
          <Button fullWidth onClick={handleSearch}>
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
        <PokemonModifier
          pokemonData={pokemonData}
          setPokemonChanges={setPokemonChanges}
          pokemonChanges={pokemonChanges}
        />
      )}
    </>
  );
};

export default Pokemon;