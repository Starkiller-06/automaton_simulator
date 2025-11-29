import React, { useState } from "react";
import AutomatonForm from "../components/AutomatonForm";
import GraphViewer from "../components/GraphViewer";
import SimulationPanel from "../components/SimulationPanel";
import "../styles/Simulator.css";

export default function Simulator() {
  const [automaton, setAutomaton] = useState(null);

  return (
    <div className="simulator-grid">
      
      <div className="sim-col">
        <h2>Automaton Builder</h2>
        <AutomatonForm onBuild={setAutomaton} />
      </div>

      <div className="sim-col">
        <h2>Automaton Visualization</h2>
        <GraphViewer automaton={automaton} />
      </div>

      <div className="sim-col">
        <h2>Simulation</h2>
        <SimulationPanel automaton={automaton} />
      </div>

    </div>
  );
}
