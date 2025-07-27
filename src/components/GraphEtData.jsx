import { useQuery } from "@tanstack/react-query";
import { LineChart } from "@mui/x-charts/LineChart";
import { GlobalStyles, useTheme } from "@mui/material";

export default function GraphEtData({ station, region }) {
  const theme = useTheme();

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
        historiques: mesuresDerniersJ.map((r, i) => {
          console.log(r);
          return {
            date: dates[i],
            temperature: r.data?.[0]?.resultat || null,
          };
        }),
      };
    },
  });

  if (isPending)
    return (
      <p className="text-[2.5vw] md:text-[2vw] lg:text-[1.3vw] lg:w-[26vw]">
        Chargement...
      </p>
    );
  if (error)
    return (
      <p className="text-[2.5vw] lg:text-[1.3vw] lg:w-[26vw]">
        Une erreur est survenue : {error.message}
      </p>
    );

  // Trie des dates dans le bon ordre
  const sortedHistoriques = [...data.historiques].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // On génère les labels du graphique à partir des dates triées + ajout de la mesure la plsu récente (call mesure1)
  const xLabels = [
    ...sortedHistoriques.map((item) =>
      new Date(item.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    ),
    new Date(data.derniereMesure.date_mesure_temp).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  ];

  // On génère les températures dans le même ordre que les dates
  const yData = [
    ...sortedHistoriques.map((item) => item.temperature ?? null),
    data.derniereMesure.resultat,
  ];

  return (
    <div className="mb-1.5 lg:w-[28vw] lg:border-l-1 lg:pl-[2vw]">
      <h1 className="text-[4vw] font-medium md:text-[3vw] lg:text-[1.5vw]">
        {" "}
        {data?.derniereMesure.libelle_cours_eau ?? "N/A"}
      </h1>
      <ul className="text-[3vw] flex justify-between w-full max-w-[90vw] my-[5vw] items-center md:text-[2.5vw] mt-[2vw] lg:text-[1.2vw] lg:flex-col lg:items-baseline lg:my-3 lg:w-[26vw]">
        <div className="flex flex-col gap-1 w-[42vw] lg:w-[26vw]">
          <li className="lg:flex lg:flex-col lg:mb-2">
            {" "}
            <span className="lg:text[10vw]">
              Code commune <span className="lg:invisible">:</span>{" "}
            </span>
            {data?.derniereMesure.code_commune}
          </li>
          <li className="lg:flex lg:flex-col lg:mb-2">
            {" "}
            <span>
              Commune <span className="lg:invisible">:</span>{" "}
            </span>
            {data?.derniereMesure.libelle_commune}
          </li>
        </div>
        <div className="flex flex-col gap-1 w-[42vw] text-left break-words lg:w-[26vw]">
          <li className="lg:flex lg:flex-col lg:mb-2">
            <span>
              Code station <span className="lg:invisible">:</span>{" "}
            </span>
            {data?.derniereMesure.code_station ?? "N/A"}
          </li>
          <li className="lg:flex lg:flex-col lg:mb-2">
            <span>
              Région <span className="lg:invisible">:</span>{" "}
            </span>
            {region}
          </li>
        </div>
      </ul>
      <h4 className="mb-5 text-[3.5vw] font-medium md:text-[2.8vw] md:mb-7 lg:text-[1.3vw]">
        Evolution des températures
      </h4>
      <div className="w-[90vw] h-[30vh] md:h-[40vh] pb-[2vw] chart-wrapper lg:w-[26vw] lg:h-[41vh]">
        {/* Création d'un graphique pour afficher l'évolution de la température d'un cours d'eau sélectionné */}

        <GlobalStyles
          styles={{
            ".MuiChartsAxis-tickLabel": {
              fill: "#ABC4FF !important",
              fontSize: "2.5vw !important",
              [theme.breakpoints.up("lg")]: {
                fontSize: "1vw !important",
              },
            },
          }}
        />

        <LineChart
          xAxis={[{ scaleType: "point", data: xLabels }]}
          yAxis={[{ min: 0, max: 30 }]}
          series={[
            {
              type: "line",
              label: "Température (en °C)",
              data: yData,
              color: "#ABC4FF",
            },
          ]}
        />
      </div>
    </div>
  );
}
