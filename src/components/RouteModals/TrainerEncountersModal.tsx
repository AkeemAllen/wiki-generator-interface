import {
  Autocomplete,
  Button,
  Checkbox,
  Grid,
  Modal,
  NumberInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useEditRoute } from "../../apis/routesApis";
import { usePokemonStore, useRouteStore } from "../../stores";
import { Trainers } from "../../types";
import { capitalize, isNullEmptyOrUndefined } from "../../utils";
import PokemonCard from "../PokemonCard";

type ModalProps = {
  routeName: string;
  opened: boolean;
  close: () => void;
};

const TrainersEncounterModal = ({ routeName, opened, close }: ModalProps) => {
  const pokemonList = usePokemonStore((state) => state.pokemonList);
  const routes = useRouteStore((state) => state.routes);
  const setRoutes = useRouteStore((state) => state.setRoutes);

  const [currentTrainer, setCurrentTrainer] = useInputState<string>("");
  const [pokemonName, setPokemonName] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [trainers, setTrainers] = useState<Trainers>({} as Trainers);

  const addPokemonToTrainer = () => {
    setTrainers((trainers: Trainers) => {
      return {
        ...trainers,
        [currentTrainer]: {
          is_important: trainers[currentTrainer]?.is_important ?? false,
          pokemon: [
            ...trainers[currentTrainer]?.pokemon,
            {
              name: pokemonName,
              id: pokemonList?.find((p) => p.name === pokemonName)?.id,
              level,
            },
          ],
        },
      };
    });
    setPokemonName("");
    setLevel(0);
  };

  const updateTrainerImportance = (trainer: string, isImportant: boolean) => {
    setTrainers((trainers: Trainers) => {
      return {
        ...trainers,
        [trainer]: {
          ...trainers[trainer],
          is_important: isImportant,
        },
      };
    });
  };

  const removePokemonFromTrainer = (pokemonName: string, trainer: string) => {
    // setTrainers((trainers: Trainers) => {
    //   let currentTrainers = {
    //     ...trainers,
    //     [trainer]: trainers[trainer].pokemon.filter(
    //       (p) => p.name !== pokemonName
    //     ),
    //   };
    //   if (currentTrainers[trainer].length === 0) {
    //     delete currentTrainers[trainer];
    //   }
    //   return currentTrainers;
    // });
  };

  const { mutate: submitTrainers } = useEditRoute({
    routeName,
    body: {
      trainers,
    },
    onSuccess: (data: any) => {
      close();
      setRoutes(data.routes);
      notifications.show({ message: "Trainers updated successfully" });
    },
  });

  useEffect(() => {
    setTrainers(routes[routeName]?.trainers || {});
  }, [routeName]);

  return (
    <Modal withCloseButton={false} opened={opened} onClose={close} size={"90%"}>
      <Title>{routeName}</Title>
      <Title order={4} mt={20}>
        Trainers
      </Title>
      <Grid mt={5}>
        <Grid.Col span={2}>
          <TextInput
            label="Trainer Name"
            value={currentTrainer}
            onChange={setCurrentTrainer}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Autocomplete
            label="Pokemon for current trainer"
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
            label="Level"
            value={level}
            onChange={(e: number) => setLevel(e)}
          />
        </Grid.Col>
        <Grid.Col span={2} mt={25}>
          <Button
            disabled={
              isNullEmptyOrUndefined(pokemonName) ||
              level === 0 ||
              isNullEmptyOrUndefined(currentTrainer)
            }
            onClick={addPokemonToTrainer}
          >
            Add Pokemon
          </Button>
        </Grid.Col>
      </Grid>
      {!isNullEmptyOrUndefined(trainers) &&
        Object.keys(trainers).map((trainer, index) => {
          return (
            <div key={index}>
              <Grid columns={24}>
                <Grid.Col span={3}>
                  <Title order={4} mt={20}>
                    {capitalize(trainer)}
                  </Title>
                </Grid.Col>
                <Grid.Col span={3}>
                  <Checkbox
                    mt={24}
                    size={"xs"}
                    label="Important Trainer"
                    checked={trainers[trainer].is_important}
                    onChange={() => {
                      updateTrainerImportance(
                        trainer,
                        !trainers[trainer].is_important
                      );
                    }}
                  />
                </Grid.Col>
              </Grid>
              <Grid mt={10}>
                {trainers[trainer].pokemon.map((pokemon, index) => {
                  return (
                    <Grid.Col span={2} key={index}>
                      <PokemonCard
                        pokemonId={pokemon.id as number}
                        pokemonName={pokemon.name as string}
                        removePokemon={() =>
                          removePokemonFromTrainer(
                            pokemon.name as string,
                            trainer
                          )
                        }
                        level={pokemon.level as number}
                      />
                    </Grid.Col>
                  );
                })}
              </Grid>
            </div>
          );
        })}
      <Button fullWidth mt={20} onClick={() => submitTrainers()}>
        Submit Trainers
      </Button>
    </Modal>
  );
};

export default TrainersEncounterModal;
