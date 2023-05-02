import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetPokemon = (onSuccess: (data: any) => void) => {
  return useQuery({
    queryKey: ["pokemon"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}/pokemon`).then((res) =>
        res.json()
      ),
    onSuccess,
    refetchOnWindowFocus: false,
  });
};

export const useGetPokemonByName = ({ pokemonName, onSuccess }: any) => {
  return useQuery({
    queryKey: ["pokemon", pokemonName],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}/pokemon/${pokemonName}`).then(
        (res) => res.json()
      ),
    onSuccess,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

export const useSavePokemonChanges = ({
  pokemonName,
  pokemonChanges,
  onSuccess,
  onError,
}: any) => {
  return useMutation({
    mutationFn: () => {
      return fetch(
        `${import.meta.env.VITE_BASE_URL}/pokemon/edit/${pokemonName}`,
        {
          method: "POST",
          body: JSON.stringify(pokemonChanges),
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => res.json());
    },
    onSuccess,
    onError,
  });
};
