import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import "../styles/AutomatonForm.css";

export default function AutomatonForm() {
  const [states, setStates] = useState([]);
  const [alphabet, setAlphabet] = useState([]);
  const [startState, setStartState] = useState("");
  const [finalStates, setFinalStates] = useState([]);
  const [transition, setTransition] = useState({});
  const [mode, setMode] = useState("DFA")

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
                            ? transition[state][symbol].join(", ") : "Select")
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
    const automaton = {
      mode,
      states,
      alphabet,
      startState,
      finalStates,
      transition
    }

    console.log("AUTOMATON:", automaton);

    alert("Automaton built! Check the console.");
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
              name="states" 
              onChange={(e) => setStates(e.target.value.split(',').map(s => s.trim()))}
            />
          </div>      
          <div>
            <label>Alphabet</label>
            <input 
              type="text" 
              name="alphabet" 
              onChange={(e) => setAlphabet(e.target.value.split(',').map(s => s.trim()))}
            />
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Start State</label>
            <input 
              type="text" 
              name="start-state" 
              onChange={(e) => setStartState(e.target.value.trim())}
            />
          </div>      
          <div>
            <label>Final State</label>
            <input 
              type="text" 
              name="final-state" 
              onChange={(e) => setFinalStates(e.target.value.split(",").map(s => s.trim()))}
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
      ) }
            
    </div>
  );
}
