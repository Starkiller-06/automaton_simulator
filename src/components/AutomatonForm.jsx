import React, { useState } from "react";
import { createNFA } from "../automas/nfa";
import { createDFA } from "../automas/dfa";
import { parseInput } from "../utils";
import "../styles/AutomatonForm.css"; // CSS Import

export default function AutomatonForm({ onBuild }) {
  const [statesStr, setStatesStr] = useState("");
  const [alphabetStr, setAlphabetStr] = useState("");
  const [startState, setStartState] = useState("");
  const [finalStatesStr, setFinalStatesStr] = useState("");
  const [transition, setTransition] = useState({});
  const [mode, setMode] = useState("DFA");
  const [error, setError] = useState(null);

  const getStatesArray = () => parseInput(statesStr);
  const getAlphabetArray = () => parseInput(alphabetStr);

  const updateTransition = (fromState, symbol, toState) => {
    setTransition((prev) => {
      const prevFrom = prev[fromState] || {};
      const current = prevFrom[symbol];

      if (mode === "DFA") {
        return {
          ...prev,
          [fromState]: { ...prevFrom, [symbol]: toState },
        };
      } else {
        const currentArr = Array.isArray(current) ? current : (current ? [current] : []);
        const nextSet = new Set(currentArr);
        if (nextSet.has(toState)) nextSet.delete(toState);
        else nextSet.add(toState);

        return {
          ...prev,
          [fromState]: { ...prevFrom, [symbol]: Array.from(nextSet) },
        };
      }
    });
  };

  const handleSubmit = () => {
    setError(null);
    try {
      let automaton;
      if (mode === "NFA") {
        const statesArr = parseInput(statesStr);
        const alphabetArr = parseInput(alphabetStr);
        automaton = createNFA(statesArr, alphabetArr, transition, startState, finalStatesStr);
      } else {
        automaton = createDFA(statesStr, alphabetStr, transition, startState, finalStatesStr);
      }
      onBuild(automaton);
    } catch (err) {
      setError(err.message);
    }
  };

  const currentStates = getStatesArray();
  const currentAlphabet = getAlphabetArray();

  return (
    <div className="form-container">
      {error && <div className="error-msg">{error}</div>}

      <div className="form-header">
        <div className="form-group">
          <label className="form-label">Mode</label>
          <select 
            value={mode} 
            onChange={(e) => { setMode(e.target.value); setTransition({}); }}
            className="form-select"
          >
            <option value="DFA">DFA</option>
            <option value="NFA">NFA</option>
          </select>
        </div>
        <button onClick={handleSubmit} className="btn-primary">
          Build
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">States</label>
          <input 
            type="text" 
            placeholder="q0, q1"
            className="form-input"
            value={statesStr}
            onChange={(e) => setStatesStr(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Alphabet</label>
          <input 
            type="text" 
            placeholder="0, 1"
            className="form-input"
            value={alphabetStr}
            onChange={(e) => setAlphabetStr(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Start State</label>
          <input 
            type="text" 
            placeholder="q0"
            className="form-input"
            value={startState}
            onChange={(e) => setStartState(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Final States</label>
          <input 
            type="text" 
            placeholder="q1"
            className="form-input"
            value={finalStatesStr}
            onChange={(e) => setFinalStatesStr(e.target.value)}
          />
        </div>
      </div>

      {currentStates.length > 0 && currentAlphabet.length > 0 && (
        <div className="transition-matrix-container">
          <label className="form-label">Transition Function</label>
          <table className="transition-matrix">
            <thead>
              <tr>
                <th>State</th>
                {currentAlphabet.map(sym => <th key={sym}>{sym}</th>)}
              </tr>
            </thead>
            <tbody>
              {currentStates.map(s => (
                <tr key={s}>
                  <td className="state-cell">{s}</td>
                  {currentAlphabet.map(sym => (
                    <td key={sym}>
                      <TransitionDropdown 
                        from={s} 
                        symbol={sym} 
                        mode={mode} 
                        currentVal={transition[s]?.[sym]} 
                        allStates={currentStates}
                        onUpdate={updateTransition}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TransitionDropdown({ from, symbol, mode, currentVal, allStates, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  
  let displayVal = "Select";
  if (mode === "DFA") {
    if (currentVal) displayVal = currentVal;
  } else {
    if (Array.isArray(currentVal) && currentVal.length > 0) displayVal = currentVal.join(", ");
  }

  return (
    <div className="dropdown-container">
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
        {displayVal}
      </button>
      {isOpen && (
        <>
          <div className="dropdown-menu">
            {allStates.map(target => (
              <div 
                key={target} 
                className={`dropdown-item ${
                  (mode === "DFA" && currentVal === target) || (mode === "NFA" && currentVal?.includes(target)) 
                  ? "active" : ""
                }`}
                onClick={() => {
                  onUpdate(from, symbol, target);
                  if (mode === "DFA") setIsOpen(false);
                }}
              >
                {target} {mode==="NFA" && currentVal?.includes(target) ? "✓" : ""}
              </div>
            ))}
          </div>
          <div style={{ position: 'fixed', inset: 0, zIndex: 5 }} onClick={() => setIsOpen(false)}></div>
        </>
      )}
    </div>
  );
}