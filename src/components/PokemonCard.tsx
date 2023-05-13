import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Card,
  Grid,
  Modal,
  Title,
} from "@mantine/core";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import {
  useAbilityStore,
  useItemsStore,
  useMovesStore,
  useNatureStore,
} from "../stores";
import { Trainers } from "../types";
import { capitalize, isNullEmptyOrUndefined } from "../utils";

type PokemonCardProps = {
  removePokemon: () => void;
  pokemonName: string;
  pokemonId: number;
  encounterRate?: number;
  level?: number;
  routeName?: string;
  trainerName?: string;
  trainers?: Trainers;
  setTrainers?: React.Dispatch<React.SetStateAction<Trainers>>;
};

const PokemonCard = ({
  removePokemon,
  pokemonName,
  pokemonId,
  encounterRate,
  level,
  trainers,
  trainerName = "",
  setTrainers = () => {},
}: PokemonCardProps) => {
  const getSpriteUrl = () => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  };
  const movesList = useMovesStore((state) => state.movesList);
  const naturesList = useNatureStore((state) => state.naturesList);
  const abilityList = useAbilityStore((state) => state.abilityList);
  const itemsList = useItemsStore((state) => state.itemsList);

  const [opened, { open, close }] = useDisclosure(false);
  const [item, setItem] = useInputState<string>("");
  const [nature, setNature] = useInputState<string>("");
  const [ability, setAbility] = useInputState<string>("");
  const [pokemonMoves, setPokemonMoves] = useInputState<string[]>([
    "",
    "",
    "",
    "",
  ]);

  const handleMoveChange = (index: number, value: string) => {
    console.log(index, value);
    pokemonMoves[index] = value;
    setPokemonMoves([...pokemonMoves]);
  };

  const updatePokemon = () => {
    setTrainers((trainers: Trainers) => {
      return {
        ...trainers,
        [trainerName]: {
          sprite_url: trainers[trainerName]?.sprite_url ?? "",
          is_important: trainers[trainerName]?.is_important ?? false,
          pokemon: trainers[trainerName]?.pokemon.map((p) => {
            if (p.name === pokemonName) {
              return {
                ...p,
                item,
                nature,
                ability,
                moves: pokemonMoves.filter((m) => m !== ""),
              };
            }
            return p;
          }),
        },
      };
    });
    close();
  };

  useEffect(() => {
    if (trainers && trainerName && trainers[trainerName]) {
      const pokemon = trainers[trainerName].pokemon.find(
        (p) => p.name === pokemonName
      );
      if (pokemon) {
        setItem(pokemon.item);
        setNature(pokemon.nature);
        setAbility(pokemon.ability);
        if (pokemon.moves) {
          while (pokemon.moves?.length < 4) {
            pokemon.moves.push("");
          }
          setPokemonMoves(pokemon.moves);
        }
      }
    }
  }, [pokemonName]);

  return (
    <>
      <Card
        withBorder
        shadow="sm"
        sx={{
          ":hover > #action-icon": {
            display: "block",
          },
        }}
      >
        {trainers && trainers[trainerName].is_important && (
          <ActionIcon
            variant="filled"
            id="action-icon"
            sx={{
              display: "none",
              position: "absolute",
              right: 50,
              top: 10,
              zIndex: 1,
            }}
          >
            <IconEdit onClick={open} />
          </ActionIcon>
        )}
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
          <IconTrash onClick={removePokemon} />
        </ActionIcon>
        <Card.Section sx={{ display: "grid" }}>
          <img
            src={getSpriteUrl()}
            alt={pokemonName}
            width={80}
            style={{ justifySelf: "center" }}
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
          {capitalize(pokemonName)}
          <br />
          {!isNullEmptyOrUndefined(encounterRate)
            ? `${encounterRate}%`
            : `lv.${level}`}
        </Box>
      </Card>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size={"70%"}
      >
        <Title order={2} mb={20}>
          {capitalize(pokemonName)}
        </Title>
        <Grid mb={20}>
          <Grid.Col span={6}>
            <Autocomplete
              label="Held Item"
              value={item}
              onChange={setItem}
              data={itemsList}
              dropdownPosition={"bottom"}
              sx={{ zIndex: 10 }}
            />
            <Autocomplete
              label="Ability"
              value={ability}
              onChange={setAbility}
              data={abilityList}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Autocomplete
              label="Nature"
              value={nature}
              onChange={setNature}
              data={naturesList}
              dropdownPosition={"bottom"}
            />
          </Grid.Col>
        </Grid>
        Moves
        {pokemonMoves.map((move, index) => {
          return (
            <Autocomplete
              mb="lg"
              key={index}
              value={move}
              onChange={(value: string) => handleMoveChange(index, value)}
              data={movesList}
              dropdownPosition="bottom"
            />
          );
        })}
        <Button onClick={updatePokemon}>Update</Button>
      </Modal>
    </>
  );
};

export default PokemonCard;
