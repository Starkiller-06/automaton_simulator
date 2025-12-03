import React from "react";
import "../styles/GraphViewer.css"; // CSS Import

export default function GraphViewer({ automaton }) {
  if (!automaton) {
    return (
      <div style={{ textAlign: "center", color: "#6b7280", marginTop: "20%" }}>
        Waiting for automaton...
      </div>
    );
  }

  const { mode, states, alphabet, startState, finalStates, transition } = automaton;

  return (
    <div className="graph-container">
      <div className="graph-info-bar">
        <div><span className="info-label">Start:</span> <span className="info-val start">{startState}</span></div>
        <div><span className="info-label">Final:</span> <span className="info-val final">{finalStates.join(", ")}</span></div>
        <div className="badge">{mode}</div>
      </div>

      <div className="nodes-grid">
        {states.map((state) => (
          <div key={state} className={`node-card ${finalStates.includes(state) ? 'is-final' : ''}`}>
            <div className="node-header">
              <span className="node-title" title={state}>{state}</span>
              <div className="node-badges">
                {state === startState && <span className="tag start">Start</span>}
                {finalStates.includes(state) && <span className="tag final">Final</span>}
              </div>
            </div>
            
            <ul className="transition-list">
              {alphabet.map((symbol) => {
                const target = transition[state]?.[symbol];
                if (!target || (Array.isArray(target) && target.length === 0)) return null;
                
                const display = Array.isArray(target) ? target.join(", ") : target;
                return (
                  <li key={symbol} className="transition-item">
                    <span className="symbol-key">{symbol}</span>
                    <span className="target-val" title={display}>→ {display}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
