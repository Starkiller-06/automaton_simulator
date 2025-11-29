import React from "react";
import "../styles/GraphViewer.css";

export default function GraphViewer({ automaton }) {
  if (!automaton) {
    return (
      <div className="state-block">
        <p style={{ textAlign: "center", opacity: 0.8 }}>
          Waiting for automaton...
        </p>
      </div>
    );
  }

  const { mode, states, alphabet, startState, finalStates, transition } = automaton;

  return (
    <div className="graph-container">
      <h3>{mode} Visualization</h3>

      <div className="graph-info">
        <p><strong>Start State:</strong> {startState}</p>
        <p><strong>Final States:</strong> {finalStates.join(", ")}</p>
      </div>

      <div className="graph-block">
        {states.map((state) => (
          <div key={state} className="state-block">
            <h4 className="state-title">
              {state}
              {state === startState ? " (Start)" : ""}
              {finalStates.includes(state) ? " (Final)" : ""}
            </h4>

            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {alphabet.map((symbol) => {
                const target = transition[state]?.[symbol];

                if (!target) {
                  return <li key={symbol}>{symbol}: —</li>;
                }

                const targets = Array.isArray(target)
                  ? target.join(", ")
                  : target;

                return <li key={symbol}>{symbol}: {targets}</li>;
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
