export const Types = {
  GRASS: "grass",
  FIRE: "fire",
  WATER: "water",
  BUG: "bug",
  NORMAL: "normal",
  POISON: "poison",
  ELECTRIC: "electric",
  GROUND: "ground",
  FLYING: "flying",
  FIGHTING: "fighting",
  PSYCHIC: "psychic",
  ROCK: "rock",
  ICE: "ice",
  GHOST: "ghost",
  DRAGON: "dragon",
  DARK: "dark",
  STEEL: "steel",
  FAIRY: "fairy",
};

export type Move = {
  [key: string]: number;
};

export type Stats = {
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
};

export type PokemonChanges = {
  id: number;
  types: string[];
  abilities: string[];
  stats: Stats;
  moves: Move;
  machineMoves: string[];
  evolution: string;
};

export type PokemonData = {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  stats: Stats;
  moves: Move;
  sprite: string;
};
