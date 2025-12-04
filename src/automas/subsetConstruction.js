import { epsilonClosure, move } from "./nfa";

// Produces a stable string key for a set of states (e.g., ["q1","q2"] → "q1,q2")
//Used as the unique identifier for subsets in the DFA construction.
function subsetKey(set) {
  return [...set].sort().join(",");
}

// Generates a human-readable DFA state name for a subset (e.g., {q1, q2} → "q1_q2")
function subsetName(set) {
  if (set.size === 0) return "∅";
  return [...set].sort().join("_");
}

export default function subsetConstruction(nfa) {
  const { alphabet, transition, startState, finalStates } = nfa;
  const subsetToName = new Map(); // // Maps each NFA subset to a DFA state name (e.g., {q1, q2} → "q1_q2").
  const queue = [];
  const dfaTransitions = {};

  const startSet = epsilonClosure(new Set([startState]), transition); // Start with the ε-closure of the NFA start state
  const startKey = subsetKey(startSet);
  const startName = subsetName(startSet);

  subsetToName.set(startKey, startName);
  queue.push(startSet);

  // BFS: explore all reachable subsets
  while (queue.length > 0) {
    const currentSet = queue.shift();
    const currentKey = subsetKey(currentSet);
    const currentName = subsetToName.get(currentKey);

    dfaTransitions[currentName] = {};

    for (const symbol of alphabet) {
      // Move with the symbol, then apply ε-closure
      const moved = move(currentSet, symbol, transition);
      const nextSet = epsilonClosure(moved, transition);
      const nextKey = subsetKey(nextSet);
      const nextName = subsetName(nextSet);

      // If this subset hasn't been seen before, enqueue it
      if (!subsetToName.has(nextKey)) {
        subsetToName.set(nextKey, nextName);
        queue.push(nextSet);
      }
      dfaTransitions[currentName][symbol] = nextName;
    }
  }

  // Build the list of DFA states and identify accepting states
  const dfaStates = [...subsetToName.values()];
  const dfaFinalStates = [];

  // A DFA state is final if its subset contains any NFA final state
  for (const [key, name] of subsetToName.entries()) {
    if (name === "∅") continue;
    const subsetStates = key.split(",");
    if (subsetStates.some((s) => finalStates.includes(s))) {
      dfaFinalStates.push(name);
    }
  }

  return {
    mode: "DFA",
    states: dfaStates,
    alphabet,
    transition: dfaTransitions,
    startState: startName,
    finalStates: dfaFinalStates,
  };
}
