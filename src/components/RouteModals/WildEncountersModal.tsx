import {
  Autocomplete,
  Button,
  Grid,
  Modal,
  NativeSelect,
  NumberInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useEditRoute } from "../../apis/routesApis";
import { usePokemonStore, useRouteStore } from "../../stores";
import { Encounters } from "../../types";
import { capitalize, isNullEmptyOrUndefined } from "../../utils";
import PokemonCard from "../PokemonCard";

type ModalProps = {
  routeName: string;
  opened: boolean;
  close: () => void;
};

const WildEncountersModal = ({ routeName, opened, close }: ModalProps) => {
  const [currentEncountertype, setCurrentEncountertype] =
    useInputState<string>("grass");
  const [pokemonName, setPokemonName] = useInputState<string>("");
  const pokemonList = usePokemonStore((state) => state.pokemonList);
  const [encounterRate, setEncounterRate] = useState<number>(0);
  const routes = useRouteStore((state) => state.routes);
  const setRoutes = useRouteStore((state) => state.setRoutes);
  const [areaLevels, setAreaLevels] = useState(
    routes[routeName]?.wild_encounters_area_levels || {}
  );
  const [wildEncounters, setWildEncounters] = useState<Encounters>(
    { ...routes[routeName]?.wild_encounters } || {}
  );

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

  useEffect(() => {
    setWildEncounters(routes[routeName]?.wild_encounters || {});
    setAreaLevels(routes[routeName]?.wild_encounters_area_levels || {});
  }, [routeName]);

  return (
    <Modal withCloseButton={false} opened={opened} onClose={close} size={"90%"}>
      <Title>{routeName}</Title>
      <Title order={4} mt={20}>
        Wild Encounters
      </Title>
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
              pokemonList === undefined ? [] : pokemonList.map((p) => p.name)
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
                      {pokemon.area_level === undefined && (
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
                      )}
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
    </Modal>
  );
};

export default WildEncountersModal;
