import {
  AppShell,
  Button,
  Grid,
  Header,
  MantineProvider,
  Text,
  TextInput,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
import "./App.css";
import Pokemon from "./components/Pokemon";
import { PokemonChanges, PokemonData } from "./constants";

function App() {
  const [pokemonName, setPokemonName] = useInputState<string>("");
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [pokemonChanges, setPokemonChanges] = useState<PokemonChanges | null>(
    null
  );
  const [JsonFile, setJsonFile] = useState<any>({});

  const handleSearch = () => {
    fetch(`http://localhost:8081/pokemon/${pokemonName}`).then((res) => {
      res.json().then((data) => {
        setPokemonData(data);
      });
    });
  };

  // const generateJsonChanges = () => {
  //   const fileData = JSON.stringify(JsonFile);
  //   console.log(fileData);
  //   fetch("http://localhost:8081/generate", {
  //     method: "POST",
  //     body: fileData,
  //     headers: { "Content-Type": "application/json" },
  //   })
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err));
  // };

  const saveChanges = () => {
    console.log(pokemonChanges);
    fetch(`http://localhost:8081/save-changes/${pokemonName}`, {
      method: "POST",
      body: JSON.stringify(pokemonChanges),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  useUpdateEffect(() => {
    console.log(pokemonData);
  }, [pokemonData]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        header={
          <Header height={{ base: 70 }} p="xl">
            <Text>Wiki Generator Interface</Text>
          </Header>
        }
        // aside={
        //   <Aside width={{ sm: 200, lg: 300 }} p="md">
        //     {Object.keys(JsonFile).map((key) => {
        //       return (
        //         <Card shadow={"sm"} radius="md" withBorder mt="20px">
        //           <Text>{key}</Text>
        //         </Card>
        //       );
        //     })}
        //     <Button
        //       mt="20px"
        //       disabled={Object.keys(JsonFile).length === 0}
        //       onClick={generateJsonChanges}
        //     >
        //       Generate Json Changes
        //     </Button>
        //   </Aside>
        // }
      >
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
          <Pokemon
            pokemonData={pokemonData}
            setPokemonChanges={setPokemonChanges}
            pokemonChanges={pokemonChanges}
          />
        )}
      </AppShell>
    </MantineProvider>
  );
}

export default App;
