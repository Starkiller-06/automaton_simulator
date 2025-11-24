import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import "../styles/AutomatonForm.css";

export default function AutomatonForm() {
  const [states, setStates] = useState([]);
  const [alphabet, setAlphabet] = useState([]);
  const [startState, setStartState] = useState("");
  const [finalStates, setFinalStates] = useState([]);
  const [transition, setTransition] = useState({});

  function GenTransitionTable({ states, alphabet, transition, onSelect }) {

    function updateTransition (fromState, symbol, toState) {
      setTransition(prev => ({
        ...prev,
        [fromState]: {
          ...prev[fromState],
          [symbol]: toState
        }
      }));
    }

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
                      {transition[state]?.[symbol] || "Select"}
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

  return (
    <div className="automaton-form">

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
            <input type="text" name="states" />
          </div>      
          <div>
            <label>Final State</label>
            <input type="text" name="alphabet" />
          </div>
        </div>   
      </div>

      <div className="transition-table">
        <label>Transition Function</label>
        <GenTransitionTable 
          states={states} 
          alphabet={alphabet} 
          transition={transition}
          onSelect={updateTransition}
          />  
      </div>  

      
    </div>
  );
}
