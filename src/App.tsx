import {
  AppShell,
  Button,
  Grid,
  Header,
  Image,
  MantineProvider,
  NumberInput,
  SimpleGrid,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pokemonName, setPokemonName] = useInputState("");
  const [pokemonData, setPokemonData] = useState();

  const handleSearch = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then((res) => {
      res.json().then((data) => {
        setPokemonData(data);
      });
    });
  };

  useEffect(() => {
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
        //   <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
        //     <Aside p="md" hiddenBreakpoint={"sm"} width={{ sm: 200, lg: 200 }}>
        //       <Text>Aside</Text>
        //     </Aside>
        //   </MediaQuery>
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
            <Button fullWidth disabled>
              Save Changes
            </Button>
          </Grid.Col>
        </Grid>
        {pokemonData && (
          <>
            <Grid mt="xl" grow>
              <Grid.Col span={3} offset={2}>
                <Image
                  src={pokemonData["sprites"]["front_default"]}
                  maw={200}
                />
              </Grid.Col>
              <Grid.Col span={5}>
                <SimpleGrid cols={2} mt="xl">
                  <TextInput value={"grass"} label="Type 1" />
                  <TextInput value={"grass"} label="Type 1" />
                </SimpleGrid>
                <SimpleGrid cols={2} mt="xl">
                  <TextInput value={"grass"} label="Ability 1" />
                  <TextInput value={"grass"} label="Ability 2" />
                </SimpleGrid>
              </Grid.Col>
            </Grid>
            <Title order={2}>Stats</Title>
            <SimpleGrid cols={2}>
              <NumberInput label="HP" />
              <NumberInput label="Attack" />
              <NumberInput label="Defense" />
              <NumberInput label="Special Attack" />
              <NumberInput label="Special Defense" />
              <NumberInput label="Speed" />
            </SimpleGrid>
            <Title order={2} mt="lg">
              Moves
            </Title>
            <Table withBorder>
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
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>sludge wave</td>
                  <td>machine</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td>vine-whip</td>
                  <td>
                    <TextInput defaultValue={"level-up"} />
                  </td>
                  <td>
                    <NumberInput defaultValue={3} />
                  </td>
                </tr>
              </tbody>
            </Table>
          </>
        )}
      </AppShell>
    </MantineProvider>
  );
}

export default App;
