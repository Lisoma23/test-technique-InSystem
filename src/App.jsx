import "./App.css";
import API from "./HubeauAPI";
import GraphEtData from "./GraphEtData";
import { useState } from "react";

export default function App() {
  const [codeStation, setCodeStation] = useState("");

  console.log(codeStation + "station clic")

  return (
    <div className="App">
      <header className="App-header">
        <API sendCodeStation={setCodeStation} />
        <GraphEtData station={codeStation} />
      </header>
    </div>
  );
}
