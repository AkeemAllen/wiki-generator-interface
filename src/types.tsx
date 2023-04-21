export type MoveDetails = {
  accuracy: number;
  pp: number;
  power: number;
  type: string;
  damage_class: string;
};

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
  evolution?: string;
};

export type TrainerOrWildPokemon = {
  id?: number;
  name?: string;
  level?: number;
  moves?: string[];
  item?: string;
  nature?: string;
  ability?: string;
  catch_rate?: number;
  area_level?: number;
};

export type Encounters = {
  [key: string]: TrainerOrWildPokemon[];
};

export type Trainers = {
  [key: string]: TrainerOrWildPokemon[];
};

export type RouteProperties = {
  wild_encounters?: Encounters;
  trainers?: Trainers;
  important_trainers?: Trainers;
};

export type Routes = {
  [key: string]: RouteProperties;
};
