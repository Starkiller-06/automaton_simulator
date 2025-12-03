import { parseInput, ValidStartState ,ValidFinalStates } from "../utils.js";

export function createDFA(unStates, unAlphabet, transition, startState, unfinalStates) {
    
    const states = parseInput(unStates);
    const alphabet = parseInput(unAlphabet);
    const finalStates = parseInput(unfinalStates);
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

export function DFAsimulation(dfa, inputString) {
    let currentState = dfa.startState;
    const trace = [currentState];

    for (const symbol of inputString) {
        if(!dfa.alphabet.includes(symbol)) {
            return {
                result: "rejected",
                trace,
                error: `Symbol '${symbol}' not in alphabet`,
            };    
        }

        const nextState = dfa.transition[currentState]?.[symbol];

        if (nextState === undefined) {
            return {
                result: "rejected",
                trace,
                error: `No transition defined for state '${currentState}' with symbol '${symbol}'`,
            };
        }

        currentState = nextState;
        trace.push(currentState);
    }

    const isAccepted = dfa.finalStates.includes(currentState);

    return {
        result: isAccepted? "accepted" : "rejected",
        trace,
    };    
}

