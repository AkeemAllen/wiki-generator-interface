import { ActionIcon, Box, Card, Image } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { capitalize, isNullEmptyOrUndefined } from "../utils";

type PokemonCardProps = {
  removePokemon: () => void;
  pokemonName: string;
  pokemonId: number;
  encounterRate?: number;
  level?: number;
};

const PokemonCard = ({
  removePokemon,
  pokemonName,
  pokemonId,
  encounterRate,
  level,
}: PokemonCardProps) => {
  const getSpriteUrl = () => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  };

  return (
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
        <IconTrash onClick={removePokemon} />
      </ActionIcon>
      <Card.Section>
        <Image src={getSpriteUrl()} alt={pokemonName} />
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
  );
};

export default PokemonCard;
