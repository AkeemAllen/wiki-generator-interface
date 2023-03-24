export type Move = {
  [key: string]: {
    level_learned_at: number;
    learn_method: string;
    delete?: boolean;
  };
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
