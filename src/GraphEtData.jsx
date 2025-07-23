import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function GraphEtData({ station }) {
  console.log(station);
  // Call de l'API Hubeau
  const { isPending, error, data } = useQuery({
    queryKey: ["tempsStation", station], // La requête est refaite seulement si station change, car la queryKey change (pas la même donnée en cache)
    enabled: station !== 0, // Ne fait l'appel que si le code station est différent 0
    queryFn: async () => {
      // Pour récupérer les infos de la dernière mesure de température
      const infosTemp1 = await fetch(
        `https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station=${station}&size=1&sort=desc`
      );

      const temp1 = await infosTemp1.json();

      const mesure1 = temp1.data[0];

      if (!mesure1) throw new Error("Aucune date trouvée");

      // Création des dates m-1, m-2, m-3
      const baseDate = new Date(mesure1.date_mesure_temp); // Transforme au format aaaa-mm-jjT00:00.000Z
      const getDateString = (d) => d.toISOString().split("T")[0]; // Garder que la partie avant le T

      const dates = [1, 2, 3].map((i) => {
        const date = new Date(baseDate);
        date.setMonth(baseDate.getMonth() - i); // getMonth renvoie le m puis retire i au m ensuite setDate set le mois de la date à m-i
        return getDateString(date);
      });

      // Requêtes pour récupérer les mesures de m-1 m-2 et m-3
      const mesuresDerniersJ = await Promise.all(
        dates.map((date) =>
          fetch(
            `https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station=${station}&date_debut_mesure=${date}&date_fin_mesure=${date}&size=1&sort=desc`
          ).then((res) => res.json())
        )
      );

      console.log(mesuresDerniersJ);

      // On return l'antiereté des datas de la première mesure et la température des 3 derniers mois + leur date
      return {
        derniereMesure: mesure1,
        historiques: mesuresDerniersJ.map((r, i) => ({
          date: dates[i],
          temperature: r.data[0]?.resultat || null,
        })),
      };
    },
  });

  if (isPending) return <p>Chargement...</p>;
  if (error) return <p>Une erreur est survenue : {error.message}</p>;

  return (
    <div>
      {data?.derniereMesure.date_mesure_temp} :{" "}
      {data?.derniereMesure.resultat || "Aucune donnée"}
      {data?.derniereMesure.resultat ? data?.derniereMesure.symbole_unite : ""}
      <ul>
        {data.historiques.map((item) => (
          <li key={item.date}>
            {item.date} : {item.temperature ?? "Pas de donnée"}
            {item.temperature ? data?.derniereMesure.symbole_unite : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
