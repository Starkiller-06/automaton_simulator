import { parseInput, ValidStartState, ValidFinalStates } from "../utils.js";
    
const EPS = "eps";

export function createNFA(unStates, unAlphabet, transition, startState, unFinalStates) {
    const states = parseInput(unStates);
    const alphabet = parseInput(unAlphabet);
    const finalStates = parseInput(unFinalStates);
    ValidFinalStates(states, finalStates);
    ValidStartState(states, startState);

    return {
        mode: "NFA", 
        states, 
        alphabet, 
        transition, 
        startState, 
        finalStates
    };
}


// Computes all states reachable from the given set by only using epsilon transitions, without consuming any input symbol.
export function epsilonClosure(stateSet, transition) {
    const stack = [...stateSet];
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


//Computes all states reachable from the given set using a specific input symbol.
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


export function simulateNFA(nfa, inputString, options = {}) {
    const {showTrace = true} = options;

    for (const ch of inputString) {
        if (!nfa.alphabet.includes(ch)) { //If string symbol not in alphabet, reject.
            return{
                result: "rejected",
                trace: [],
                reason: `Invalid symbol '${ch}'`,
            };
        }
    }

    // Start with the epsilon-closure of the start state
    let current = epsilonClosure(new
        Set([nfa.startState]), nfa.transition);
        const trace = [];

        if(showTrace)
        trace.push(setToSortedArray(current));

         // Process each symbol in the input
        for(const symbol of inputString) {
            const afterMove = move(current, symbol, nfa.transition);
            current = epsilonClosure(afterMove, nfa.transition);

            if(showTrace)
                trace.push(setToSortedArray(current));

            // If no states remain, the NFA is stuck, the string is rejected
            if (current.size === 0) {
                return {
                result: "rejected",
                trace,
                reason: `No states reachable after '${symbol}'`,
                };
            }
        }

        // Accept if any of the current states is a final state
        const accepted = [...current].some(s =>
            nfa.finalStates.includes(s)
        );

        return {
            result: accepted ? "accepted" : "rejected",
            trace,
            finalState: setToSortedArray(current),
        };
}