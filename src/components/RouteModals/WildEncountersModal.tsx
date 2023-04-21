import {
  Autocomplete,
  Button,
  Chip,
  Grid,
  Modal,
  NativeSelect,
  Title,
} from "@mantine/core";
import { useHover, useInputState } from "@mantine/hooks";
import { useState } from "react";
import { usePokemonStore } from "../../store";
import { Encounters, Routes } from "../../types";
import { capitalize, isNullEmptyOrUndefined } from "../../utils";

type ModalProps = {
  routeName: string;
  opened: boolean;
  close: any;
  wildEncounters: Encounters;
  setRoutes: (routes: Routes) => void;
};

const WildEncountersModal = ({
  routeName,
  opened,
  close,
  wildEncounters,
  setRoutes,
}: ModalProps) => {
  const [currentEncountertype, setCurrentEncountertype] =
    useInputState<string>("grass");
  const [pokemonName, setPokemonName] = useInputState<string>("");
  const pokemonList = usePokemonStore((state) => state.pokemonList);
  const [_wildEncounters, setWildEncounters] =
    useState<Encounters>(wildEncounters);
  const { hovered, ref } = useHover();

  const addPokemonToEncountertype = () => {
    setWildEncounters((wildEncounters: Encounters) => {
      return {
        ...wildEncounters,
        [currentEncountertype]: [
          ...(wildEncounters[currentEncountertype] ?? []),
          { name: pokemonName },
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

  const submitWildEncounters = () => {
    setRoutes((routes: Routes) => {
      return {
        ...routes,
        [routeName]: {
          ...routes[routeName],
          wild_encounters: _wildEncounters,
        },
      };
    });
    close();
  };

  return (
    <Modal withCloseButton={false} opened={opened} onClose={close} size={"90%"}>
      <Title>{routeName}</Title>
      <Title order={4} mt={20}>
        Wild Encounters
      </Title>
      <Grid>
        <Grid.Col span={4}>
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
            label="Pokemon to add to current encounter type"
            placeholder="Pokemon Name"
            value={pokemonName}
            onChange={(value) => setPokemonName(value)}
            data={pokemonList === undefined ? [] : pokemonList}
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
      {_wildEncounters !== undefined &&
        Object.keys(_wildEncounters).map((encounterType, index) => {
          return (
            <div key={index}>
              <Title mt={20} order={4}>
                {capitalize(encounterType)} Encounters
              </Title>
              <Grid mt={10}>
                {_wildEncounters[encounterType]?.map((pokemon, index) => {
                  return (
                    <Grid.Col key={index} span={2}>
                      <Chip
                        onChange={() =>
                          removePokemonFromEncountertype(
                            pokemon.name as string,
                            encounterType
                          )
                        }
                      >
                        <div ref={ref}>
                          {hovered
                            ? "Delete"
                            : capitalize(pokemon.name as string)}{" "}
                        </div>
                      </Chip>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </div>
          );
        })}
      <Button fullWidth mt={20}>
        Submit Wild Encounters
      </Button>
    </Modal>
  );
};

export default WildEncountersModal;
