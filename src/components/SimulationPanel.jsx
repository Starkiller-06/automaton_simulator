import React, { useState } from "react";
import { DFAsimulation } from "../automas/dfa";
import { simulateNFA } from "../automas/nfa";

export default function SimulationPanel({ automaton }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  if (!automaton) {
    return <div style={{ textAlign: "center", color: "#6b7280", marginTop: "2rem" }}>Waiting for automaton...</div>;
  }

  const run = () => {
    console.log(automaton)
    let res;
    if (automaton.mode === "DFA") {
      res = DFAsimulation(automaton, input);
    } else {
      res = simulateNFA(automaton, input);
    }
    setResult(res);
  };

  const isError = result?.error;
  const displayReason = result?.reason || result?.error;
  
  const finalStateDisplay = result?.finalState 
    ? (Array.isArray(result.finalState) ? `{ ${result.finalState.join(", ")} }` : result.finalState)
    : (result?.trace ? result.trace[result.trace.length - 1] : "—");

  return (
    <div className="sim-container">
      <div className="sim-controls">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter input string..."
          className="sim-input"
        />
        <button onClick={run} className="btn-run">Run</button>
      </div>

      {result && (
        <div className={`sim-result-box ${result.result === 'accepted' ? 'accepted' : 'rejected'}`}>
          <h3 className="result-status" style={{ color: result.result === 'accepted' ? '#4ade80' : '#f87171' }}>
            {result.result}
          </h3>
          
          {isError && !result.trace ? (
             <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>{displayReason}</div>
          ) : (
            <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {displayReason && (
                <div style={{ color: '#fde047', fontSize: '0.75rem' }}>Note: {displayReason}</div>
              )}
              
              <div>
                <span style={{ color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>Final State(s):</span>
                <span style={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                  {finalStateDisplay}
                </span>
              </div>
              
              <div>
                <span style={{ color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>Trace:</span>
                <div className="sim-trace">
                  {result.trace.map((step, i) => (
                    <div key={i} className="trace-step">
                      {i > 0 && <span style={{ margin: '0 4px', color: '#4b5563' }}>→</span>}
                      <span className="trace-val">
                        {Array.isArray(step) ? `{${step.join(",")}}` : step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}