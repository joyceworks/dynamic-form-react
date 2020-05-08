import React, {useReducer} from "react";
import {Cell} from "../Cell";
import {getData, setValue} from "./util";

interface DynamicFormProps {
}

export const DynamicFormContext = React.createContext<any>(null);

const data = {
    current: null,
    data: {
        type: 'grid',
        id: '1',
        swimlanes: [{
            span: 100, elements: [
                {
                    type: 'input',
                    id: '2',
                    value: null,
                    labeled: true,
                    label: 'test',
                    required: true,
                    placeholder: 'test ph',
                    warningable: true
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
                setValue(state.data, action.target, action.value);
                return {...state};
            default:
                return state;
        }
    }, data);
    return <DynamicFormContext.Provider value={dispatch}>
        <>
            <span>{JSON.stringify(state)}</span>
            <span>{JSON.stringify(getData(data.data))}</span>
            <Cell element={data.data.swimlanes[0].elements[0]}/>
        </>
    </DynamicFormContext.Provider>;
}