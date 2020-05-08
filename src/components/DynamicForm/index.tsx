import React, {useReducer} from "react";
import {Cell} from "../Cell";

interface DynamicFormProps {
}

export const DynamicFormContext = React.createContext<any>(null);

const data = {
    current: null,
    data: {
        type: 'grid',
        id: new Date().getTime(),
        swimlanes: [{
            span: 100, elements: [
                {
                    type: 'input',
                    id: new Date().getTime(),
                    value: null
                }
            ]
        }]
    }
};

export const DynamicForm = function (props: DynamicFormProps) {
    const [state, dispatch] = useReducer(function (state: any, action: any) {
        switch (action.type) {
            case 'SET_CURRENT':
                return {...state, current: action.element};
            case 'SET_VALUE':
                state.data.swimlanes[0].elements[0].value = action.value;
                return {...state}
            default:
                return state;
        }
    }, data);
    return <DynamicFormContext.Provider value={dispatch}>
        <>
            <span>{JSON.stringify(state)}</span>
            <Cell element={{
                value: data.data.swimlanes[0].elements[0].value,
                labeled: true,
                label: 'test',
                required: true,
                placeholder: 'test ph',
                warningable: true
            }}/>
        </>
    </DynamicFormContext.Provider>;
}