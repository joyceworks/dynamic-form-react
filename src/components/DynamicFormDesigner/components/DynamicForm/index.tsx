import React, {CSSProperties, forwardRef, useReducer} from "react";
import {setValue} from "./util";
import './index.css';
import {Swimlane} from "./components/Swimlane";
import {CellData} from "../../schemas/CellData";

interface DynamicFormProps {
    direction?: 'column' | 'row';
    element: CellData;
    style?: CSSProperties;
}

export const DynamicFormContext = React.createContext<any>(null);

export const DynamicForm = forwardRef(({direction = 'column', element, style}: DynamicFormProps, ref: any) => {
    const [, dispatch] = useReducer(function (state: any, action: any) {
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
        <table ref={ref} className={'swimlanes'} style={style}>
            <tbody>
            {
                direction === 'column' ? <tr>
                    {
                        element.swimlanes?.map((swimlane, index) => {
                            return <Swimlane key={element.id + '-' + index} direction={direction}
                                             elements={swimlane.cellDataList}/>;
                        })
                    }
                </tr> : <>
                    {
                        element.swimlanes?.map((swimlane, index) => {
                            return <tr key={element.id + '-' + index}>
                                <Swimlane elements={swimlane.cellDataList} direction={direction}/>
                            </tr>;
                        })
                    }
                </>
            }
            </tbody>
        </table>
    </DynamicFormContext.Provider>;
})