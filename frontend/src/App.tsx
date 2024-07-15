import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function App() {
  const queryClient = useQueryClient();

  const getHydrationHistory = async () => {
    try {
      const result = await fetch(
        "https://waterfollow-api.onrender.com/hydrations"
      );
      const { data } = await result.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const postHydrationHistory = async (bodyData: any) => {
    try {
      await fetch("https://waterfollow-api.onrender.com/hydrations", {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["hydrations-history"],
    queryFn: getHydrationHistory,
  });

  const { mutate } = useMutation({
    mutationFn: postHydrationHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hydrations-history"] });
    },
  });

  return (
    <>
      <h1>Waterfollow</h1>
      {isLoading && <p>Carregando...</p>}
      {!isLoading &&
        data.map((item: any) => <li>{`${item.day} | ${item.hydration}ml`}</li>)}
      <br />
      <button
        onClick={() => {
          mutate({
            quantityInMilliliters: 300,
          });
        }}
      >
        Adicionar 300ml
      </button>
    </>
  );
}
