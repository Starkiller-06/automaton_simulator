export function createDFA(states, alphabet, transition, startState, UfinalStates) {
    
    const finalStates = UfinalStates.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (!states.includes(startState)) {
        throw new Error(`Start state '${startState}' is not in the set of states`);
    }

    for (const f of finalStates) {
        if (!states.includes(f)) {
            throw new Error(`Final state '${f}' is not in the set of states`);
        }
    }

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

