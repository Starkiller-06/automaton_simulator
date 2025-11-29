import { parseInput, ValidStartState ,ValidFinalStates } from "../utils.js";


const EPS = "eps";

export function createNFA(UnStates, UnAlphabet, transition, startState, UfinalStates) {

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

function epsilonClosure(stateSet, transition) {
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

function move(states, symbol, transition) {
    const toStates = new Set(); //possible states that can be moved to given a symbol

    // for each state in states
    for (const state of states) {
        if (transition[state]) {
            const movesTo = transition[state][symbol] || [];

            for (const state of movesTo ) {
                toStates.add(state);
            }
        }
    }

    return toStates;
}

export default function subsetConstruction(nfa) {
    const dfaStates = new Map(); //what in a nfa is hold as multiple states such as from state A with input 0 we can move to 'B, C' will be hold here as a single state where from state A we can move to the next state where B = [B, C]
    const dfaTransitionFunct = {};
    const newStates = [];


    // ID generetation for mapping
    let stateCount = 0;

    const getStateId = () => {
        const id = String.fromCharCode(65 + stateCount);
        stateCount++;
        return id;
    };

    const nfaStartState = new Set([nfa.startState]);
    const dfaStartState = epsilonClosure(nfaStartState, nfa.transition);

    const dfaStartId = getStateId();
    dfaStates.set(dfaStartState, dfaStartId);
    newStates.push(dfaStartState);


    // Transition generation
    while (newStates.length > 0) {
        const current = newStates.shift();
        const currentID = dfaStates.get(current);

        dfaTransitionFunct[currentID] = {};

        for (const symbol of nfa.alphabet) {
            const movesTo = move(current, symbol, nfa.transition);

            const next = epsilonClosure(movesTo, nfa.transition);

            let nextID;

            //Check if key/entry is already on the map
            const isEntry = Array.from(dfaStates.keys()).find(
                set => 
                    set.size === next.size && [...set].every(val => next.has(val))
            );

            if (isEntry) {
                nextID = dfaStates.get(isEntry)
            } else {
                nextID = getStateId();
                dfaStates.set(next, nextID);
                newStates.push(next);
            }

            dfaTransitionFunct[currentID][symbol] = nextID; 
        }
    }

    const dfaFinalStates =  new Set();

    for (const [nfaSet, dfaID] of dfaStates.entries()) {
        for (const nfaState of nfaSet) {
            if (nfa.finalStates.includes(nfaState)) {
                dfaFinalStates.add(dfaID);
                break;
            }
        }
    }

    return {

        states: Array.from(dfaStates.values()),
        alphabet: nfa.alphabet,
        transition: dfaTransitionFunct,
        startState: dfaStartId,
        finalStates: Array.from(dfaFinalStates)
    };

}