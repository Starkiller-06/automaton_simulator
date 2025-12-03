import React from "react";

export default function TransitionTable({ automaton }) {
  if (!automaton) return null;

  const { states, alphabet, transition } = automaton;

  return (
    <div className="tt-container">
      <table className="tt-table">
        <thead>
          <tr>
            <th className="tt-header">State</th>
            {alphabet.map((symbol) => (
              <th className="tt-header" key={symbol}>{symbol}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {states.map((state) => (
            <tr key={state}>
              <td className="tt-cell">{state}</td>
              {alphabet.map((symbol) => {
                const to = transition[state]?.[symbol];
                const formatted =
                  Array.isArray(to) ? to.join(", ") : to || "—";
                return <td className="tt-cell" key={symbol}>{formatted}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
