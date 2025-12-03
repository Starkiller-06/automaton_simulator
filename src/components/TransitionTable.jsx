import React from "react";
// Uses Simulator.css classes

export default function TransitionTable({ automaton }) {
  if (!automaton) return null;
  const { states, alphabet, transition } = automaton;

  return (
    <div className="table-container">
      <table className="standard-table">
        <thead>
          <tr>
            <th>State</th>
            {alphabet.map(sym => <th key={sym}>{sym}</th>)}
          </tr>
        </thead>
        <tbody>
          {states.map(state => (
            <tr key={state}>
              <td className="cell-highlight">{state}</td>
              {alphabet.map(sym => {
                const target = transition[state]?.[sym];
                const display = Array.isArray(target) ? `{${target.join(",")}}` : (target || "∅");
                return <td key={sym}>{display}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
