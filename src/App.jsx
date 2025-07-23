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
    <div className="App">
      <header className="App-header">
        <API
          sendCodeStation={setCodeStation}
          sendRegionStation={setRegionStation}
        />
        <GraphEtData station={codeStation} region={regionStation} />
      </header>
    </div>
  );
}