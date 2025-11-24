export function parseInput(inputString) {
    const input = inputString.split(',').map(s => s.trim()).filter(s => s.length > 0);

    return input;
}
    
export function ValidStartState(states, startState) {
    if (!states.includes(startState)) {
        throw new Error(`Start state '${startState}' is not in the set of states`);
    }
}

export function ValidFinalStates(states, finalStates) {
    for (const f of finalStates) {
        if (!states.includes(f)) {
            throw new Error(`Final state '${f}' is not in the set of states`);
        }
    }
}