export function DFAdefinition(states, alphabet, transitionFunction, startState, finalStates) {
    return {
        states,
        alphabet,
        transitionFunction,
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
                result: false,
                trace,
                error: `Symbol '${symbol}' not in alphabet`,
            };    
        }

        const nextState = dfa.transitionFunction[currentState]?.[symbol];

        if (nextState === undefined) {
            return {
                result: false,
                trace,
                error: `No transition defined for state '${currentState}' with symbol '${symbol}'`,
            };
        }

        currentState = nextState;
        trace.push(currentState);
    }

    const isAccepted = dfa.finalStates.includes(currentState);

    return {
        result: isAccepted? 'accepted' : 'rejected',
        trace,
    };    
}

