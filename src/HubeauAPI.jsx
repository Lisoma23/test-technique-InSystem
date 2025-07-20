import { useQuery } from "@tanstack/react-query";

export default function HubeauAPI() {

  // call de l'API Hubeau
  const { isPending, error, data } = useQuery({
    queryKey: ["stationsHubeau"],
    queryFn: () =>
      fetch("https://hubeau.eaufrance.fr/api/v1/temperature/station").then(
        (res) => res.json()
      ),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  console.log(data);

  return (
    <div>
      {data.data.map((cours) => (
        <li>{cours.libelle_cours_eau ?? `N/A`}</li> // récupère le nom des cours d'eau et si ils n'existent pas met N/A
      ))}
    </div>
  );
}
