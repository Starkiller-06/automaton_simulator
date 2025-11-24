import { parseInput, ValidStartState ,ValidFinalStates } from "../utils.js";

export function createDFA(UnStates, UnAlphabet, transition, startState, UfinalStates) {
    
    const states = parseInput(UnStates);
    const alphabet = parseInput(UnAlphabet);
    const finalStates = parseInput(UfinalStates);
    ValidFinalStates(states, finalStates);
    ValidStartState(states, startState);

    return {
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

