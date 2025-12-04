import { parseInput, ValidStartState ,ValidFinalStates } from "../utils.js";

//DFA Formal Definition
export function createDFA(unStates, unAlphabet, transition, startState, unfinalStates) {
    const states = parseInput(unStates);
    const alphabet = parseInput(unAlphabet);
    const finalStates = parseInput(unfinalStates);
    ValidFinalStates(states, finalStates);
    ValidStartState(states, startState);

    return {
        mode: "DFA", //Used in frontend to toggle mode 
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
    console.log(dfa, inputString)

    //Check if each symbol in the input string belongs to the DFA alphabet
    for (const symbol of inputString) {
        if(!dfa.alphabet.includes(symbol)) {
            return {
                result: "rejected",
                trace,
                error: `Symbol '${symbol}' not in alphabet`,
            };    
        }

        // Get the next state according to the transition function
        // If no transition exists for (currentState, symbol), nextState will be undefined
        const nextState = dfa.transition[currentState]?.[symbol]; 

        if (nextState === undefined) {
            return {
                result: "rejected",
                trace,
                error: `No transition defined for state '${currentState}' with symbol '${symbol}'`,
            };
        }

        currentState = nextState;
        trace.push(currentState); //Add new current state to trace
    }

    const isAccepted = dfa.finalStates.includes(currentState); // Accept if the final state is one of the DFA's accepting states

    return {
        result: isAccepted? "accepted" : "rejected",
        trace,
    };    
}

