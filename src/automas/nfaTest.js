import { createNFA, simulateNFA } from "./nfa.js"

const nfa = createNFA(
  ["q0", 'q1'],
  ["a", "b"],
  {
    q0: { eps: ["q1"], a:["q1"]},
    q1: {a:["q1"], b:["q1"]}
  },
  "q0",
  ["q1"]
);

console.log("Test 1:", simulateNFA(nfa, ""));
console.log("Test 2:", simulateNFA(nfa, "a"));
console.log("Test 3:", simulateNFA(nfa, "b"));
console.log("Test 4:", simulateNFA(nfa, "c"))