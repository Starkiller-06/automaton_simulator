import React, { useState } from "react";
import AutomatonForm from "../components/AutomatonForm.jsx";
import GraphViewer from "../components/GraphViewer.jsx";
import SimulationPanel from "../components/SimulationPanel.jsx";
import subsetConstruction from "../automas/subsetContruction.js"; 
import TransitionTable from "../components/TransitionTable.jsx";

// ../automas/nfa.js
import "../styles/Simulator.css";

export default function Simulator() {
  const [automaton, setAutomaton] = useState(null);
  const [convertedDFA, setConvertedDFA] = useState(null);

  return (
    <div className="simulator-grid">
      
      {/* Left Column */}
      <div className="sim-col">
        <h2>Automaton Builder</h2>
        <AutomatonForm 
          onBuild={(a) => {
            setAutomaton(a);
            setConvertedDFA(null); // reset DFA if user builds a new machine
          }} 
        />
      </div>

      {/* Middle Column - Visualization */}
      <div className="sim-col">
        <h2>Automaton Visualization</h2>
        
        <GraphViewer automaton={automaton} />

        {automaton && (
          <button 
            className="convert-btn"
            onClick={() => {
              const dfa = subsetConstruction(automaton);
              setConvertedDFA(dfa);
            }}
          >
            Convert NFA to DFA
          </button>
        )}

        {convertedDFA && (
          <>
            <h3 style={{ marginTop: "1rem" }}>Converted DFA</h3>

            {/* Transition Table */}
            <h4>Transition Table</h4>
            <TransitionTable automaton={convertedDFA} />

          </>
)}

      </div>

      {/* Right Column - Simulation */}
      <div className="sim-col">
        <h2>Simulation</h2>

        {!convertedDFA && (
          <SimulationPanel automaton={automaton} />
        )}

        {convertedDFA && (
          <>
            <h3>DFA Simulation</h3>
            <SimulationPanel automaton={convertedDFA} />
          </>
        )}
      </div>

    </div>
  );
}
