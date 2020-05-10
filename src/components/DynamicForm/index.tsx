import React, {CSSProperties, useReducer} from "react";
import {Element} from "../../schemas/Element";
import {Cell} from "../Cell";
import {getData, setValue} from "./util";
import './index.css';
import {Swimlane} from "./components/Swimlane";

interface DynamicFormProps {
    direction?: 'column' | 'row';
    element: Element;
    style?: CSSProperties;
}

export const DynamicFormContext = React.createContext<any>(null);

export const DynamicForm = function ({direction = 'column', element, style}: DynamicFormProps) {
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
        <table className={'swimlanes'} style={style}>
            <tbody>
            {
                direction === 'column' ? <tr>
                    {
                        element.swimlanes?.map((swimlane, index) => {
                            return <Swimlane key={element.id + '-' + index} direction={direction}
                                             elements={swimlane.elements}/>;
                        })
                    }
                </tr> : <>
                    {
                        element.swimlanes?.map((swimlane, index) => {
                            return <tr key={element.id + '-' + index}>
                                <Swimlane elements={swimlane.elements} direction={direction}/>
                            </tr>;
                        })
                    }
                </>
            }
            </tbody>
        </table>
    </DynamicFormContext.Provider>;
}