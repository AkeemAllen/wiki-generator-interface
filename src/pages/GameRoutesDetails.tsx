import {
  Autocomplete,
  Button,
  Grid,
  NativeSelect,
  NumberInput,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { useEditRoute } from "../apis/routesApis";
import PokemonCard from "../components/PokemonCard";
import { usePokemonStore, useRouteStore } from "../stores";
import { AreaLevels, Encounters } from "../types";
import { capitalize, isNullEmptyOrUndefined } from "../utils";

type GameRoutesDetailsProps = {
  routeName: string;
};

export async function loader({ params }: any) {
  return {
    routeName: params.routeName,
  };
}

const GameRoutesDetails = () => {
  const { routeName } = useLoaderData();
  const pokemonList = usePokemonStore((state) => state.pokemonList);
  const setRoutes = useRouteStore((state) => state.setRoutes);
  const routes = useRouteStore((state) => state.routes);

  const [currentEncountertype, setCurrentEncountertype] =
    useInputState<string>("grass");
  const [activeTab, setActiveTab] = useState<string | null>("wild-encounters");
  const [pokemonName, setPokemonName] = useInputState<string>("");
  const [encounterRate, setEncounterRate] = useState<number>(0);
  const [areaLevels, setAreaLevels] = useState<AreaLevels>({} as AreaLevels);
  const [wildEncounters, setWildEncounters] = useState<Encounters>(
    {} as Encounters
  );
  useEffect(() => {
    setWildEncounters(routes[routeName]?.wild_encounters || {});
    setAreaLevels(routes[routeName]?.wild_encounters_area_levels || {});
  }, [routeName]);

  const addPokemonToEncountertype = () => {
    setWildEncounters((wildEncounters: Encounters) => {
      return {
        ...wildEncounters,
        [currentEncountertype]: [
          ...(wildEncounters[currentEncountertype] ?? []),
          {
            name: pokemonName,
            id: pokemonList?.find((p) => p.name === pokemonName)?.id,
            encounter_rate: encounterRate,
          },
        ],
      };
    });
    setPokemonName("");
  };

  const removePokemonFromEncountertype = (
    pokemonName: string,
    encounterType: string
  ) => {
    setWildEncounters((wildEncounters: Encounters) => {
      let currentEncounters = {
        ...wildEncounters,
        [encounterType]: wildEncounters[encounterType].filter(
          (pokemon) => pokemon.name !== pokemonName
        ),
      };
      if (currentEncounters[encounterType].length === 0) {
        delete currentEncounters[encounterType];
      }
      return currentEncounters;
    });
  };

  const { mutate: submitWildEncounters } = useEditRoute({
    routeName,
    body: {
      wild_encounters: wildEncounters,
      wild_encounters_area_levels: areaLevels,
    },
    onSuccess: (data: any) => {
      close();
      setRoutes(data.routes);
      notifications.show({ message: "Successfully updated wild encounters" });
    },
  });
  return (
    <>
      <Title order={4} mt={20}>
        {routeName}
      </Title>
      <Tabs mt={20} value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="wild-encounters">Wild Encounters</Tabs.Tab>
          <Tabs.Tab value="trainer-encounters">Trainer Encounters</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="wild-encounters">
          <Title order={5}>
            <Grid mt={5}>
              <Grid.Col span={2}>
                <NativeSelect
                  label="Encounter Type"
                  placeholder="Encounter Type"
                  onChange={(value) => setCurrentEncountertype(value)}
                  value={currentEncountertype}
                  data={["surf", "grass", "fishing", "cave", "other"]}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Autocomplete
                  label="Pokemon for current encounter type"
                  placeholder="Pokemon Name"
                  value={pokemonName}
                  onChange={(value) => setPokemonName(value)}
                  data={
                    pokemonList === undefined
                      ? []
                      : pokemonList.map((p) => p.name)
                  }
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  label="Encounter Rate"
                  value={encounterRate}
                  onChange={(e: number) => setEncounterRate(e)}
                />
              </Grid.Col>
              <Grid.Col span={2} mt={25}>
                <Button
                  disabled={isNullEmptyOrUndefined(pokemonName)}
                  onClick={addPokemonToEncountertype}
                >
                  Add Pokemon
                </Button>
              </Grid.Col>
            </Grid>
            {!isNullEmptyOrUndefined(wildEncounters) &&
              Object.keys(wildEncounters).map((encounterType, index) => {
                return (
                  <div key={index}>
                    <Title order={4} mt={20}>
                      {capitalize(encounterType)} Encounters{" "}
                    </Title>
                    <TextInput
                      placeholder="Level Range. Eg.'lv 1-5'"
                      mt={10}
                      sx={{ width: "12rem" }}
                      value={areaLevels[encounterType] || ""}
                      onChange={(e) =>
                        setAreaLevels({
                          ...areaLevels,
                          [encounterType]: e.target.value,
                        })
                      }
                    />
                    <Grid mt={10}>
                      {wildEncounters[encounterType]?.map((pokemon, index) => {
                        return (
                          <Grid.Col key={index} span={2}>
                            <PokemonCard
                              pokemonId={pokemon.id as number}
                              pokemonName={pokemon.name as string}
                              encounterRate={pokemon.encounter_rate as number}
                              removePokemon={() =>
                                removePokemonFromEncountertype(
                                  pokemon.name as string,
                                  encounterType
                                )
                              }
                            />
                          </Grid.Col>
                        );
                      })}
                    </Grid>
                  </div>
                );
              })}
            <Button fullWidth mt={20} onClick={() => submitWildEncounters()}>
              Submit Wild Encounters
            </Button>
          </Title>
        </Tabs.Panel>
        <Tabs.Panel value="trainer-encounters">
          <Title order={5}>Trainer Encounters</Title>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default GameRoutesDetails;
