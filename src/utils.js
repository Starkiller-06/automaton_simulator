export function parseInput(inputString) {
  if (!inputString) return [];
  if (Array.isArray(inputString)) return inputString;
  const states =  inputString.split(',').map(s => s.trim()).filter(s => s.length > 0);
//   console.log(states);
  return states;
}
    
export function ValidStartState(states, startState) {
    if (!states.includes(startState)) {
        throw new Error(`Start state '${startState}' is not in the set of states`);
    }
}

export function ValidFinalStates(states, finalStates) {
    for (const f of finalStates) {
        if (!states.includes(f)) {
            throw new Error(`Final state '${f}' is not in the set of states`);
        }
    }
}