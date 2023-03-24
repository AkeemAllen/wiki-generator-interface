import {
  Grid,
  Image,
  NativeSelect,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
import { Types } from "../constants";
import { Move, PokemonChanges, PokemonData, Stats } from "../types";
import MovesTable from "./MovesTable";
import StatsInputs from "./StatsInputs";

type PokemonProps = {
  pokemonData: PokemonData;
  pokemonChanges: PokemonChanges | null;
  setPokemonChanges: any;
};

const Pokemon = ({
  pokemonData,
  pokemonChanges,
  setPokemonChanges,
}: PokemonProps) => {
  const [typeOne, setTypeOne] = useInputState<string>("");
  const [typeTwo, setTypeTwo] = useInputState<string>("");
  const [abilityOne, setAbilityOne] = useInputState<string>("");
  const [abilityTwo, setAbilityTwo] = useInputState<string>("");
  const [moves, setMoves] = useState<Move>({} as Move);
  const [stats, setStats] = useState<Stats>({} as Stats);

  useUpdateEffect(() => {
    setPokemonChanges({
      ...pokemonChanges,
      types: [typeOne, typeTwo],
    });
  }, [typeOne, typeTwo]);

  useUpdateEffect(() => {
    setPokemonChanges({
      ...pokemonChanges,
      abilities: [abilityOne, abilityTwo],
    });
  }, [abilityOne, abilityTwo]);

  useUpdateEffect(() => {
    setPokemonChanges({
      ...pokemonChanges,
      stats: stats,
    });
  }, [stats]);

  useUpdateEffect(() => {
    setPokemonChanges({
      ...pokemonChanges,
      moves: moves,
    });
  }, [moves]);

  useEffect(() => {
    setTypeOne(pokemonData.types[0]);
    setTypeTwo(pokemonData.types[1]);
    setAbilityOne(pokemonData.abilities[0]);
    setAbilityTwo(pokemonData.abilities[1]);
    setMoves(pokemonData.moves);
    setStats({
      hp: pokemonData.stats.hp,
      attack: pokemonData.stats.attack,
      defense: pokemonData.stats.defense,
      sp_attack: pokemonData.stats.sp_attack,
      sp_defense: pokemonData.stats.sp_defense,
      speed: pokemonData.stats.speed,
    });
  }, [pokemonData]);

  return (
    <>
      <Grid mt="xl" grow>
        <Grid.Col span={3} offset={2}>
          <Image src={pokemonData.sprite} maw={200} />
        </Grid.Col>
        <Grid.Col span={5}>
          <SimpleGrid cols={2} mt="xl">
            <NativeSelect
              label={`Type 1`}
              value={typeOne}
              onChange={setTypeOne}
              data={Object.keys(Types).map((key) => Types[key])}
            />
            <NativeSelect
              label={`Type 2`}
              value={typeTwo}
              onChange={setTypeTwo}
              data={Object.keys(Types).map((key: string) => Types[key])}
            />
          </SimpleGrid>
          <SimpleGrid cols={2} mt="xl">
            <TextInput
              value={abilityOne}
              onChange={setAbilityOne}
              label="Ability 1"
            />
            <TextInput
              value={abilityTwo}
              onChange={setAbilityTwo}
              label="Ability 2"
            />
          </SimpleGrid>
        </Grid.Col>
      </Grid>
      <StatsInputs setStats={setStats} stats={stats} />
      <MovesTable moves={moves} setMoves={setMoves} />
    </>
  );
};

export default Pokemon;
