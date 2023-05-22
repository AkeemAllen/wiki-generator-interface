import {
  ActionIcon,
  Autocomplete,
  Button,
  Center,
  Checkbox,
  Grid,
  Menu,
  Modal,
  MultiSelect,
  NumberInput,
  ScrollArea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconDots } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useEditRoute } from "../../apis/routesApis";
import { usePokemonStore, useRouteStore } from "../../stores";
import { TrainerInfo, Trainers } from "../../types";
import { capitalize, isNullEmptyOrUndefined } from "../../utils";
import PokemonCard from "../PokemonCard";

type ModalProps = {
  routeName: string;
};

const TrainersEncounterTab = ({ routeName }: ModalProps) => {
  const pokemonList = usePokemonStore((state) => state.pokemonList);
  const routes = useRouteStore((state) => state.routes);
  const setRoutes = useRouteStore((state) => state.setRoutes);

  const [currentTrainer, setCurrentTrainer] = useInputState<string>("");
  const [trainerVersions, setTrainerVersions] = useState<string[]>([]);
  const [pokemonName, setPokemonName] = useState<string>("");
  const [level, setLevel] = useState<number>(0);
  const [trainers, setTrainers] = useState<Trainers>({} as Trainers);
  const [trainerToUpdate, setTrainerToUpdate] = useState<{
    trainer: string;
    info: TrainerInfo;
  }>({ trainer: "", info: {} as TrainerInfo });

  const [
    spriteModalOpened,
    { close: closeSpriteModal, open: openSpriteModal },
  ] = useDisclosure(false);

  const [
    trainerVersionsModalOpened,
    { close: closeTrainerVersionsModal, open: openTrainerVersionsModal },
  ] = useDisclosure(false);

  const addPokemonToTrainer = () => {
    setTrainers((trainers: Trainers) => {
      let sprite_name = "";
      let is_important = false;
      let existingPokemon = trainers[currentTrainer]?.pokemon ?? [];

      if (!isNullEmptyOrUndefined(trainers[currentTrainer]?.sprite_name)) {
        sprite_name = trainers[currentTrainer]?.sprite_name;
      }
      if (!isNullEmptyOrUndefined(trainers[currentTrainer]?.is_important)) {
        is_important = trainers[currentTrainer]?.is_important;
      }

      return {
        ...trainers,
        [currentTrainer]: {
          sprite_name,
          is_important,
          pokemon: [
            ...existingPokemon,
            {
              name: pokemonName,
              id: pokemonList?.find((p) => p.name === pokemonName)?.id,
              level,
            },
          ],
        },
      };
    });
  };

  const addVersionsToTrainer = (versions: string[]) => {
    setTrainers((trainers: Trainers) => {
      return {
        ...trainers,
        [trainerToUpdate.trainer]: {
          ...trainers[trainerToUpdate.trainer],
          trainer_versions: versions,
        },
      };
    });
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

  const updateTrainerSprite = (sprite_name: string) => {
    setTrainers((trainers: Trainers) => {
      return {
        ...trainers,
        [trainerToUpdate.trainer]: {
          ...trainers[trainerToUpdate.trainer],
          sprite_name,
        },
      };
    });
  };

  const removePokemonFromTrainer = (pokemonName: string, trainer: string) => {
    let currentTrainers = {
      ...trainers,
      [trainer]: {
        ...trainers[trainer],
        pokemon: trainers[trainer].pokemon.filter(
          (p) => p.name !== pokemonName
        ),
      },
    };
    if (currentTrainers[trainer].pokemon.length === 0) {
      delete currentTrainers[trainer];
    }
    setTrainers(currentTrainers);
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
    <>
      <Grid mt={5} mb={10}>
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
      <ScrollArea.Autosize mah={800}>
        {!isNullEmptyOrUndefined(trainers) &&
          Object.keys(trainers).map((trainer, index) => {
            return (
              <div key={index}>
                <Grid columns={36}>
                  <Grid.Col span={1}>
                    <Tooltip label="Important Trainer">
                      <Checkbox
                        mt={24}
                        size={"xs"}
                        checked={trainers[trainer].is_important}
                        onChange={() => {
                          updateTrainerImportance(
                            trainer,
                            !trainers[trainer].is_important
                          );
                        }}
                      />
                    </Tooltip>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Center>
                      <Title order={4} mt={20}>
                        {capitalize(trainer)}
                      </Title>
                      <Menu shadow="sm" width={200} position="right-start">
                        <Menu.Target>
                          <ActionIcon mt={15} ml={10}>
                            <IconDots />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item
                            onClick={() => {
                              setTrainerToUpdate({
                                trainer,
                                info: trainers[trainer],
                              });
                              openSpriteModal();
                            }}
                          >
                            Update Sprite
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => {
                              setTrainerToUpdate({
                                trainer,
                                info: trainers[trainer],
                              });
                              setTrainerVersions((versions) => [
                                ...versions,
                                ...(trainers[trainer]?.trainer_versions || []),
                              ]);
                              openTrainerVersionsModal();
                            }}
                          >
                            Modify Trainer Versions
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Center>
                  </Grid.Col>
                </Grid>
                {trainers[trainer].is_important && (
                  <img
                    style={{ marginTop: 10 }}
                    src={`https://play.pokemonshowdown.com/sprites/trainers/${trainers[trainer].sprite_name}.png`}
                  />
                )}
                <Grid mt={10}>
                  {trainers[trainer].pokemon.map((pokemon, index) => {
                    return (
                      <Grid.Col span={2} key={index}>
                        <PokemonCard
                          trainers={trainers}
                          trainerName={trainer}
                          setTrainers={setTrainers}
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
      </ScrollArea.Autosize>
      <Button fullWidth mt={20} onClick={() => submitTrainers()}>
        Submit Trainers
      </Button>
      <Modal
        opened={spriteModalOpened}
        onClose={closeSpriteModal}
        withCloseButton={false}
        title="Sprite Name"
      >
        <TextInput
          label="Use the names for the sprites found here: https://play.pokemonshowdown.com/sprites/trainers/"
          placeholder="Set a sprite name"
          defaultValue={trainers[trainerToUpdate.trainer]?.sprite_name}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const { value } = e.target as HTMLInputElement;
              e.preventDefault();
              e.stopPropagation();
              updateTrainerSprite(value);
              notifications.show({
                message: "Sprite name updated successfully",
              });
              closeSpriteModal();
            }
          }}
        />
      </Modal>
      <Modal
        opened={trainerVersionsModalOpened}
        onClose={closeTrainerVersionsModal}
        withCloseButton={false}
        title="Sprite Name"
      >
        <MultiSelect
          label="Trainer Versions"
          data={trainerVersions}
          value={trainers[trainerToUpdate?.trainer]?.trainer_versions}
          onChange={(value) => addVersionsToTrainer(value)}
          searchable
          creatable
          getCreateLabel={(query) => `Create trainer version "${query}"`}
          onCreate={(query) => {
            setTrainerVersions([...trainerVersions, query]);
            return query;
          }}
        />
      </Modal>
    </>
  );
};

export default TrainersEncounterTab;
