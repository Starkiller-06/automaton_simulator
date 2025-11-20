import { DFAdefinition, DFAsimulation } from "./dfa.js";


const dfa = DFAdefinition(
    ["q0", "q1"], 
    ["a", "b"],
    {
        q0: { a: "q1", b: "q0" },
        q1: { a: "q1", b: "q0" }
    },
    "q0",
    ["q1"]
);

console.log("Testing 'abba':", DFAsimulation(dfa, "abba"));
console.log("Testing 'bbb':", DFAsimulation(dfa, "bbb"));
console.log("Testing 'aaab':", DFAsimulation(dfa, "aaab"));
console.log("Testing 'aaaa':", DFAsimulation(dfa, "aaaa"));
