import {
  Grid,
  Image,
  NativeSelect,
  NumberInput,
  SimpleGrid,
  TextInput,
  Title,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
import { PokemonChanges, PokemonData, Stats, Types } from "../constants";

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
  const [stats, setStats] = useState<Stats>({} as Stats);

  const handleStatsChange = (value: number, stat: string) => {
    setStats({ ...stats, [stat]: value });
  };

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

  useEffect(() => {
    setTypeOne(pokemonData.types[0]);
    setTypeTwo(pokemonData.types[1]);
    setAbilityOne(pokemonData.abilities[0]);
    setAbilityTwo(pokemonData.abilities[1]);
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
              data={Object.keys(Types).map((key) => Types[key])}
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
      <Title order={2}>Stats</Title>
      <SimpleGrid cols={2}>
        <NumberInput
          label="HP"
          value={stats.hp}
          onChange={(e: number) => handleStatsChange(e, "hp")}
        />
        <NumberInput
          label="Attack"
          value={stats.attack}
          onChange={(e: number) => handleStatsChange(e, "attack")}
        />
        <NumberInput
          label="Defense"
          value={stats.defense}
          onChange={(e: number) => handleStatsChange(e, "defense")}
        />
        <NumberInput
          label="Special Attack"
          value={stats.sp_attack}
          onChange={(e: number) => handleStatsChange(e, "special_attack")}
        />
        <NumberInput
          label="Special Defense"
          value={stats.sp_defense}
          onChange={(e: number) => handleStatsChange(e, "special_defense")}
        />
        <NumberInput
          label="Speed"
          value={stats.speed}
          onChange={(e: number) => handleStatsChange(e, "speed")}
        />
      </SimpleGrid>
      {/* <Title order={2} mt="lg">
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
      </Table> */}
    </>
  );
};

export default Pokemon;
