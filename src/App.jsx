import "./App.css";
import API from "./HubeauAPI";
import GraphEtData from "./GraphEtData";
import { useState, useEffect } from "react";

export default function App() {
  // Initialiser les valeurs depuis localStorage si présentes
  const [codeStation, setCodeStation] = useState(() => {
    return localStorage.getItem("codeStation") || "";
  });
  const [regionStation, setRegionStation] = useState(() => {
    return localStorage.getItem("regionStation") || "";
  });

  // Mettre à jour le localStorage à chaque changement
  useEffect(() => {
    if (codeStation) {
      localStorage.setItem("codeStation", codeStation);
    }
  }, [codeStation]);

  useEffect(() => {
    if (regionStation) {
      localStorage.setItem("regionStation", regionStation);
    }
  }, [regionStation]);

  return (
    <div className="App bg-white m-3 rounded-lg ">
      <header className="App-header w-full max-w-[90vw] mx-auto pt-4 lg:flex lg:w-95vw lg:max-w-[95vw] lg:justify-between">
        <API
          sendCodeStation={setCodeStation}
          sendRegionStation={setRegionStation}
        />
        <GraphEtData station={codeStation} region={regionStation} />
      </header>
    </div>
  );
}
