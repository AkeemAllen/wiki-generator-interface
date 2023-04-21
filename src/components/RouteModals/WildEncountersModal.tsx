import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  Image,
  Modal,
  NativeSelect,
  Title,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { usePokemonStore } from "../../store";
import { Encounters, Routes } from "../../types";
import { capitalize, isNullEmptyOrUndefined } from "../../utils";

type ModalProps = {
  routeName: string;
  opened: boolean;
  close: () => void;
  wildEncounters: Encounters;
  setRoutes: (value: React.SetStateAction<Routes>) => void;
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
  // This is just meant to track and set the state of wild encounters
  // without calling the setRoutes function too much.
  // Once the user clicks submit, we will call setRoutes with the new wild encounters.
  const [localizedWildEncounters, setLocalizedWildEncounters] =
    useState<Encounters>({});

  const addPokemonToEncountertype = () => {
    setLocalizedWildEncounters((wildEncounters: Encounters) => {
      return {
        ...wildEncounters,
        [currentEncountertype]: [
          ...(wildEncounters[currentEncountertype] ?? []),
          {
            name: pokemonName,
            id: pokemonList?.find((p) => p.name === pokemonName)?.id,
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
    setLocalizedWildEncounters((wildEncounters: Encounters) => {
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

  const getSpriteUrl = (pokemonId: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  };

  const submitWildEncounters = () => {
    setRoutes((routes: Routes) => {
      return {
        ...routes,
        [routeName]: {
          wild_encounters: localizedWildEncounters,
        },
      };
    });
    close();
  };

  useEffect(() => {
    setLocalizedWildEncounters(wildEncounters);
  }, [wildEncounters]);

  return (
    <Modal withCloseButton={false} opened={opened} onClose={close} size={"90%"}>
      <Title>{routeName}</Title>
      <Title order={4} mt={20}>
        Wild Encounters
      </Title>
      <Grid mt={5}>
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
            data={
              pokemonList === undefined ? [] : pokemonList.map((p) => p.name)
            }
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
      {localizedWildEncounters !== undefined &&
        Object.keys(localizedWildEncounters).map((encounterType, index) => {
          return (
            <div key={index}>
              <Title mt={20} order={4}>
                {capitalize(encounterType)} Encounters{" "}
              </Title>
              <Grid mt={10}>
                {localizedWildEncounters[encounterType]?.map(
                  (pokemon, index) => {
                    return (
                      <Grid.Col key={index} span={2}>
                        <Card
                          withBorder
                          shadow="sm"
                          sx={{
                            ":hover > #action-icon": {
                              display: "block",
                            },
                          }}
                        >
                          <ActionIcon
                            variant="filled"
                            id="action-icon"
                            sx={{
                              display: "none",
                              position: "absolute",
                              right: 10,
                              top: 10,
                              zIndex: 1,
                            }}
                          >
                            <IconTrash
                              onClick={() =>
                                removePokemonFromEncountertype(
                                  pokemon.name as string,
                                  encounterType
                                )
                              }
                            />
                          </ActionIcon>
                          <Card.Section>
                            <Image
                              src={getSpriteUrl(pokemon.id as number)}
                              alt={pokemon.name}
                            />
                          </Card.Section>
                          <Box
                            sx={{
                              border: "2px solid #e9ecef",
                              borderRadius: "5px",
                              textAlign: "center",
                            }}
                            p={10}
                            pt={2}
                            pb={2}
                          >
                            {capitalize(pokemon.name as string)}
                          </Box>
                        </Card>
                      </Grid.Col>
                    );
                  }
                )}
              </Grid>
            </div>
          );
        })}
      <Button fullWidth mt={20} onClick={submitWildEncounters}>
        Submit Wild Encounters
      </Button>
    </Modal>
  );
};

export default WildEncountersModal;
