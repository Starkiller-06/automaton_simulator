import React, { useState } from "react";
import { DFAsimulation } from "../automas/dfa.js";
import { simulateNFA } from "../automas/nfa.js";



export default function SimulationPanel({ automaton }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  function PrettyResult({ result }) {
  if (!result) return null;

  return (
    <div className="pretty-output">
      <h3>
        Result:{" "}
        <span className={result.result === "accepted" ? "accepted" : "rejected"}>
          {result.result.toUpperCase()}
        </span>
      </h3>

      <h4>Trace:</h4>
      <ul>
        {result.trace.map((step, i) => (
          <li key={i}>
            Step {i}:{" "}
            {Array.isArray(step)
              ? `{ ${step.join(", ")} }`
              : `{ ${step} }`}
          </li>
        ))}
      </ul>

      <h4>Final State:</h4>
      <p>
        {Array.isArray(result.finalState)
          ? `{ ${result.finalState.join(", ")} }`
          : `{ ${result.finalState} }`}
      </p>
    </div>
  );
}



  if (!automaton) {
    return (
      <div className="state-block">
        <p style={{ textAlign: "center", opacity: 0.8 }}>
          Waiting for automaton...
        </p>
      </div>
    );
  }

  function run() {
    if (automaton.mode === "DFA") {
      setResult(DFAsimulation(automaton, input));
    } else {
      setResult(simulateNFA(automaton, input));
    }
  }

  return (
    <div className="graph-container">
      <h3>Simulation</h3>

      <label>Test String</label>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
      />

      <button onClick={run}>Run Simulation</button>

      <PrettyResult result={result} />

    </div>
  );
}
