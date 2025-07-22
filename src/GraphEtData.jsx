import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function GraphEtData({ station }) {
  console.log(station);
  // Call de l'API Hubeau
  const { isPending, error, data } = useQuery({
    queryKey: ["tempsStation", station], // La requête est refaite seulement si station change, car la queryKey change (pas la même donnée en cache)
    enabled: station !== 0, // Ne fait l'appel que si le code station est différent 0
    queryFn:  () =>
      fetch(
        `https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station=${station}&size=1&sort=desc`
      ).then((res) => res.json())
  });

  const infosStation = data ?? [];

  if (isPending) return <p>Chargement...</p>;
  if (error) return <p>Une erreur est survenue : {error.message}</p>;

  return (
    <div>
      {station != 0 ? station : "Pas de station sélectionnée"}
      <br />
      {station != 0 ? infosStation?.data[0]?.code_station : "Cliquez sur une station"}
      <br />
      {station != 0 ? `température actuelle : ${infosStation?.data[0]?.resultat}${infosStation?.data[0]?.symbole_unite}` : ""}
    </div>
  );
}
