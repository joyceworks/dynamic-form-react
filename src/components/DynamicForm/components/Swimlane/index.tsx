import {Cell} from "../../../Cell";
import React, {useContext} from "react";
import {Element} from "../../../../schemas/Element";
import {DynamicFormDesignerContext} from "../../../DynamicFormDesigner";
import {createWidgetInstance} from "../../../DynamicFormDesigner/util";

interface SwimlaneProps {
    elements: Element[];
    direction: 'column' | 'row';
}

export const Swimlane = function ({elements, direction}: SwimlaneProps) {
    const dispatch = useContext(DynamicFormDesignerContext);

    const layout = direction === 'column' ? 'default' : 'inline';
    return <td className={'swimlane ' + direction}
               onMouseOver={(event) => {
                   event.stopPropagation();
                   dispatch({
                       type: 'MOUSEOVER',
                       elements: elements,
                   });
               }}
               onMouseOut={(event) => {
                   event.stopPropagation();
                   dispatch({
                       type: 'MOUSEOUT',
                       elements: elements,
                   });
               }}
               onMouseUp={(event) => {
                   event.stopPropagation();
                   dispatch({
                       type: 'MOUSEUP',
                       elements: elements,
                   });
               }}>
        {
            elements.map(child => <Cell key={child.id} layout={layout} element={child}/>)
        }
    </td>;
}