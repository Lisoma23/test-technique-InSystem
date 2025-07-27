import "../style/App.css";
import API from "./HubeauAPI";
import GraphEtData from "./GraphEtData";
import InstallButton from "./InstallButton";
import { useState, useEffect } from "react";

export default function App() {
  const [codeStation, setCodeStation] = useState(() => {
    return localStorage.getItem("codeStation") || "";
  });
  const [regionStation, setRegionStation] = useState(() => {
    return localStorage.getItem("regionStation") || "";
  });

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
    <div className="App bg-white m-3 rounded-lg">
      <header className="App-header w-full max-w-[90vw] mx-auto pt-4 lg:flex lg:w-95vw lg:max-w-[95vw] lg:justify-between">
        <API
          sendCodeStation={setCodeStation}
          sendRegionStation={setRegionStation}
        />
        <GraphEtData station={codeStation} region={regionStation} />
      </header>

      <div className="flex justify-center my-4">
        <InstallButton />
      </div>
    </div>
  );
}
