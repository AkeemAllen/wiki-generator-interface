import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Pokemon = {
  name: string;
  id: number;
};

type PokemonStoreState = {
  pokemonList: Pokemon[];
};

type PokemonStoreAction = {
  setPokemonList: (pokemonList: PokemonStoreState["pokemonList"]) => void;
};

export const usePokemonStore = create<PokemonStoreState & PokemonStoreAction>(
  devtools(
    (set) => ({
      pokemonList: [],
      setPokemonList: (pokemonList) => set(() => ({ pokemonList })),
    }),
    { name: "Pokemon Store" }
  )
);

type MovesStoreState = {
  movesList: string[];
};

type MovesStoreAction = {
  setMovesList: (movesList: MovesStoreState["movesList"]) => void;
};

export const useMovesStore = create<MovesStoreState & MovesStoreAction>(
  devtools(
    (set) => ({
      movesList: [],
      setMovesList: (movesList) => set(() => ({ movesList })),
    }),
    { name: "Moves Store" }
  )
);

// const connection = window.__REDUX_DEVTOOLS_EXTENSION__?.connect({
//   name: "Pokemon Store",
// });

// connection?.init(usePokemonStore.getState());

// let isUpdateFromDevTools = false;
// connection?.subscribe((event: any) => {
//   isUpdateFromDevTools = true;
//   if (event.type === "DISPATCH") {
//     usePokemonStore.setState(JSON.parse(event.state));
//   }
//   isUpdateFromDevTools = false;
// });

// usePokemonStore.subscribe((newState) => {
//   if (!isUpdateFromDevTools) {
//     connection?.send("State", newState);
//   }
// });
