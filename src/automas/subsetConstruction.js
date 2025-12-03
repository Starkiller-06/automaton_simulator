import { epsilonClosure, move } from "./nfa";

function subsetKey(set) {
  return [...set].sort().join(",");
}

function subsetName(set) {
  if (set.size === 0) return "∅";
  return [...set].sort().join("_");
}

export default function subsetConstruction(nfa) {
  const { alphabet, transition, startState, finalStates } = nfa;
  const subsetToName = new Map();
  const queue = [];
  const dfaTransitions = {};

  const startSet = epsilonClosure(new Set([startState]), transition);
  const startKey = subsetKey(startSet);
  const startName = subsetName(startSet);

  subsetToName.set(startKey, startName);
  queue.push(startSet);

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

      if (!subsetToName.has(nextKey)) {
        subsetToName.set(nextKey, nextName);
        queue.push(nextSet);
      }
      dfaTransitions[currentName][symbol] = nextName;
    }
  }

  const dfaStates = [...subsetToName.values()];
  const dfaFinalStates = [];
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
