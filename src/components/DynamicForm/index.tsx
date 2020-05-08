import React, {useReducer} from "react";
import {Element} from "../../schemas/Element";
import {Cell} from "../Cell";
import {getData, setValue} from "./util";
import './index.css';

interface DynamicFormProps {
    direction?: 'column' | 'row';
    element: Element;
}

export const DynamicFormContext = React.createContext<any>(null);

export const DynamicForm = function ({direction = 'column', element}: DynamicFormProps) {
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
    }, {current: null, data: element});
    return <DynamicFormContext.Provider value={dispatch}>
        <table className={'swimlanes'}>
            <tbody>
            {
                direction === 'column' ? <tr>
                    {
                        element.swimlanes?.map(swimlane => {
                            return <td className={'swimlane column'}>
                                {
                                    swimlane.elements.map(element => {
                                        return <Cell layout={'default'} element={element}/>;
                                    })
                                }
                            </td>;
                        })
                    }
                </tr> : <>
                    {
                        element.swimlanes?.map(swimlane => {
                            return <tr>
                                <td className={'swimlane default'}>
                                    {
                                        swimlane.elements.map(element => {
                                            return <Cell layout={'inline'} element={element}/>;
                                        })
                                    }
                                </td>
                            </tr>;
                        })
                    }
                </>
            }
            </tbody>
        </table>
    </DynamicFormContext.Provider>;
}