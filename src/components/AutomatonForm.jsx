import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import "../styles/AutomatonForm.css";
import { createNFA } from "../automas/nfa.js";
import { createDFA } from "../automas/dfa.js";


export default function AutomatonForm({ onBuild }) {
  const [states, setStates] = useState([]);
  const [alphabet, setAlphabet] = useState([]);
  const [startState, setStartState] = useState("");
  const [finalStates, setFinalStates] = useState([]);
  const [transition, setTransition] = useState({});
  const [mode, setMode] = useState("DFA");

  function updateTransition(fromState, symbol, toState) {
    setTransition(prev => {
      const prevFrom = prev[fromState] || {}; 
      const current = prevFrom[symbol];

      if (mode === "DFA") {
        return {
          ...prev,
          [fromState]: {
            ...prevFrom,
            [symbol]: toState
          }
        };
      }

      const nextSet = new Set(current || []);
      nextSet.has(toState) ? nextSet.delete(toState) : nextSet.add(toState);

      return {
        ...prev,
        [fromState]: {
          ...prevFrom,
          [symbol]: Array.from(nextSet)
        }
      };
    });
    onBuild(null);
  }

  function GenTransitionTable({ states, alphabet, transition, onSelect, mode }) {
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            {states.map((s) => (
              <th key={s}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alphabet.map((symbol) => (
            <tr key={symbol}>
              <td>{symbol}</td>
              {states.map((state) => (
                <td key={state}>
                  <Menu as="div" className="menu-container">
                    <MenuButton className="menu-button">
                      {
                        mode === "DFA"
                          ? (transition[state]?.[symbol] || "Select")
                          : (Array.isArray(transition[state]?.[symbol])
                              ? transition[state][symbol].join(", ")
                              : "Select")
                      }
                    </MenuButton>
                    <MenuItems className="menu-items">
                      {states.map((s) => (
                        <MenuItem key={s}>
                          {({ active }) => (
                            <button
                              className={`menu-item ${active ? "active" : ""}`}
                              onClick={() => onSelect(state, symbol, s)}
                            >
                              {s}
                            </button>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function submitForm() {
  let automaton = null;

  if (mode === "NFA") {
    automaton = createNFA(
      states,
      alphabet,
      transition,
      startState,
      finalStates.join(",")
    );
  } else {
    automaton = createDFA(
      states,
      alphabet,
      transition,
      startState,
      finalStates.join(",")
    );
  }

  automaton.mode = mode; 
  onBuild(automaton);
}



  return (
    <div className="automaton-form">

      <div>
        <div>
          <label>Select automaton: </label>
          <select 
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setTransition({});
              onBuild(null);
            }}>
            <option value="DFA">DFA</option>
            <option value="NFA">NFA</option>
          </select>
        </div>
        <div>
          <button onClick={submitForm}>Build</button>
        </div>
      </div>

      <div className="form-inputs">    
        <div className="form-row">           
          <div>
            <label>States</label>
            <input 
              type="text" 
              onChange={(e) => {
                setStates(e.target.value.split(',').map(s => s.trim()));
                onBuild(null);
              }}
            />
          </div>      
          <div>
            <label>Alphabet</label>
            <input 
              type="text" 
              onChange={(e) => {
                setAlphabet(e.target.value.split(',').map(s => s.trim()));
                onBuild(null);
              }}
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Start State</label>
            <input 
              type="text"
              onChange={(e) => {
                setStartState(e.target.value.trim());
                onBuild(null);
              }}
            />
          </div>      
          <div>
            <label>Final State</label>
            <input 
              type="text"
              onChange={(e) => {
                setFinalStates(e.target.value.split(',').map(s => s.trim()));
                onBuild(null);
              }}
            />
          </div>
        </div>   
      </div>

      {states.length > 0 && alphabet.length > 0 && (
        <div className="transition-table">
          <label>Transition Function</label>
          <GenTransitionTable 
            states={states} 
            alphabet={alphabet} 
            transition={transition}
            onSelect={updateTransition}
            mode={mode}
          />  
        </div>
      )}

    </div>
  );
}