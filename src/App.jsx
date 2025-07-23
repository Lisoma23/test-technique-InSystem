import "./App.css";
import API from "./HubeauAPI";
import GraphEtData from "./GraphEtData";
import { useState } from "react";

export default function App() {
  const [codeStation, setCodeStation] = useState("");
  const [regionStation, setRegionStation] = useState("");

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
