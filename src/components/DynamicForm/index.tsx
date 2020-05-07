import React, {useReducer} from "react";
import {act} from "react-dom/test-utils";
import {Cell} from "../Cell";

interface DynamicFormProps {
}

export const DynamicFormContext = React.createContext<any>(null);

export const DynamicForm = function (props: DynamicFormProps) {
    const [state, dispatch] = useReducer(function (state: any, action: any) {
        switch (action.type) {
            case 'SET_CURRENT':
                return {...state, current: action.element}
            default:
                return state;
        }
    }, {
        current: null
    });
    return <DynamicFormContext.Provider value={dispatch}>
        <>
            <span>{JSON.stringify(state)}</span>
            <Cell/>
        </>
    </DynamicFormContext.Provider>;
}