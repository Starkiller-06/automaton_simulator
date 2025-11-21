const EPS = "eps";

export function createNFA(states, alphabet, transition, startState, acceptState) {
  return {states, 
    alphabet, 
    transition, 
    startState, 
    acceptState}
}

export function epsilonClosure(stateSet, transition) {
  const stack = {...stateSet};
  const closure = new Set(stateSet);

  while (stack.length) {
    const s = stack.pop();
    const epsList = (transition[s] && transition[s][EPS]) || [];
      for (const t of epsList) {
        if (!closure.has(t)){
          closure.add(t);
          stack.push(t);
      }
    }
  }
  return closure;
}

export function move(stateSet, symbol, transition) {
  const result = new Set();
  for (const s of stateSet) {
    const targets = (transition[s] && transition[s][symbol]) || [];
    for (const t of targets) {
      result.add(t);
    }
  }
  return result;
}

function setToSortedArray(set) {
  return [...set].sort();
}

export function simulateNFA(nfa, inputString, options = {}){
  const {showTrace = true} = options;

  for (const ch of inputString) {
    if (!nfa.alphabet.includes(ch)) {
      return{
        result: "REJECT",
        trace: [],
        reason: `Invalid symbol '${ch}'`,
      };
    }
  }

  let current = epsilonClosure(new
    Set([nfa.startState]), nfa.transition);
    const trace = [];
    if(showTrace)
      trace.push(setToSortedArray(current));

    for(const symbol of inputString) {
      const afterMove = move(current, symbol, nfa.transition);
      current = epsilonClosure(afterMove, nfa.transition);

      if(showTrace)
        trace.push(setToSortedArray(current));

      if (current.size === 0) {
        return {
          result: "REJECT",
          trace,
          reason: `No states reachable after '${symbol}'`,
        };
      }
    }

    const accepted = [...current].some(s =>
      nfa.acceptState.includes(s)
    );

    return {
      result: accepted ? "ACCEPT" : "REJECT",
      trace,
      finalState: setToSortedArray(current),
    };
}