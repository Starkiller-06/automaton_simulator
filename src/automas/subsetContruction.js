// src/automas/subsetConstruction.js

const EPS = "eps";

// Epsilon-closure of a set of NFA states
function epsilonClosure(stateSet, transition) {
  const stack = [...stateSet];
  const closure = new Set(stateSet);

  while (stack.length) {
    const s = stack.pop();
    const epsList = (transition[s] && transition[s][EPS]) || [];
    for (const t of epsList) {
      if (!closure.has(t)) {
        closure.add(t);
        stack.push(t);
      }
    }
  }
  return closure;
}

// Move from a set of states with a symbol
function move(stateSet, symbol, transition) {
  const result = new Set();
  for (const s of stateSet) {
    const targets = (transition[s] && transition[s][symbol]) || [];
    for (const t of targets) {
      result.add(t);
    }
  }
  return result;
}

// Canonical key for a subset (for Map)
function subsetKey(set) {
  return [...set].sort().join(",");
}

// Human-readable name for a subset (what the DFA state is called)
function subsetName(set) {
  if (set.size === 0) return "∅";
  return [...set].sort().join("_"); // e.g. q1_q2_q3
}

export default function subsetConstruction(nfa) {
  const { alphabet, transition, startState, finalStates } = nfa;

  // Map: key (sorted subset string) -> DFA state name, e.g. "q1,q2" -> "q1_q2"
  const subsetToName = new Map();
  const queue = [];

  const dfaTransitions = {};

  // --- Start subset ---
  const startSet = epsilonClosure(new Set([startState]), transition);
  const startKey = subsetKey(startSet);
  const startName = subsetName(startSet);

  subsetToName.set(startKey, startName);
  queue.push(startSet);

  // --- BFS over subsets ---
  while (queue.length > 0) {
    const currentSet = queue.shift();
    const currentKey = subsetKey(currentSet);
    const currentName = subsetToName.get(currentKey);

    dfaTransitions[currentName] = {};

    for (const symbol of alphabet) {
      const moved = move(currentSet, symbol, transition);
      const nextSet = epsilonClosure(moved, transition);
      const nextKey = subsetKey(nextSet);
      const nextName = subsetName(nextSet);

      // If this subset hasn't been seen before, register it and enqueue
      if (!subsetToName.has(nextKey)) {
        subsetToName.set(nextKey, nextName);
        queue.push(nextSet);
      }

      dfaTransitions[currentName][symbol] = nextName;
    }
  }

  // --- Collect DFA states ---
  const dfaStates = [...subsetToName.values()];

  // --- DFA final states: any subset containing an NFA final state ---
  const dfaFinalStates = [];
  for (const [key, name] of subsetToName.entries()) {
    if (name === "∅") continue;
    const subsetStates = key.split(",");
    if (subsetStates.some((s) => finalStates.includes(s))) {
      dfaFinalStates.push(name);
    }
  }

  return {
    mode: "DFA",              // so GraphViewer shows "DFA Visualization"
    states: dfaStates,        // ["q1", "q1_q2", ...] based on USER states
    alphabet,                 // same alphabet user entered
    transition: dfaTransitions,
    startState: startName,
    finalStates: dfaFinalStates,
  };
}
