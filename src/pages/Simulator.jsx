import React, { useState } from "react";
import AutomatonForm from "../components/AutomatonForm";
import GraphViewer from "../components/GraphViewer";
import SimulationPanel from "../components/SimulationPanel";
import TransitionTable from "../components/TransitionTable";
import subsetConstruction from "../automas/subsetConstruction";
import "../styles/Simulator.css"; // Main CSS layout

export default function Simulator() {
  const [automaton, setAutomaton] = useState(null);
  const [convertedDFA, setConvertedDFA] = useState(null);

  const handleBuild = (newAutomaton) => {
    setAutomaton(newAutomaton);
    setConvertedDFA(null);
  };

  const handleConvert = () => {
    if (!automaton) return;
    try {
      const dfa = subsetConstruction(automaton);
      setConvertedDFA(dfa);
    } catch(e) {
      alert("Conversion Error: " + e.message);
    }
  };

  return (
    <div className="simulator-page">
      <h1 className="simulator-title">
        NFA/DFA Simulator
      </h1>
      
      <div className="simulator-grid">
        
        {/* CONTAINER 1: Form (Left) */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-number">1</span>
            <h2 className="panel-title">Builder</h2>
          </div>
          <div className="panel-content">
            <AutomatonForm onBuild={handleBuild} />
          </div>
        </div>

        {/* CONTAINER 2: Viz (Middle) */}
        <div className="panel" style={{ position: 'relative' }}>
          <div className="panel-header">
            <span className="panel-number">2</span>
            <h2 className="panel-title">Visualization</h2>
          </div>
          <div className="panel-content">
            <GraphViewer automaton={automaton} />
          </div>
          
          {/* Conversion Button Docked at Bottom of Viz */}
          {automaton && !convertedDFA && automaton.mode === "NFA" && (
            <div className="viz-footer">
              <button onClick={handleConvert} className="btn-convert">
                Convert NFA to DFA
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="right-column">
          
          {/* CONTAINER 4: Sim (Top Right) */}
          <div className="panel sim-panel-wrapper">
            <div className="panel-header">
              <span className="panel-number">4</span>
              <h2 className="panel-title">Simulation</h2>
            </div>
            <div className="panel-content">
              <SimulationPanel automaton={convertedDFA || automaton} />
            </div>
          </div>

          {/* CONTAINER 3: Table (Bottom Right) */}
          {convertedDFA && (
            <div className="panel table-panel-wrapper">
              <div className="panel-header">
                <span className="panel-number">3</span>
                <h2 className="panel-title">Transition Table (DFA)</h2>
              </div>
              <div className="panel-content">
                <TransitionTable automaton={convertedDFA} />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
