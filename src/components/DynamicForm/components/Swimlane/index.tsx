import {Cell} from "../../../Cell";
import React from "react";
import {Element} from "../../../../schemas/Element";

interface SwimlaneProps {
    elements: Element[];
    direction: 'column' | 'row';
}

export const Swimlane = function ({elements, direction}: SwimlaneProps) {
    const layout = direction === 'column' ? 'default' : 'inline';
    return <td className={'swimlane ' + direction}>
        {
            elements.map(child => <Cell key={child.id} layout={layout} element={child}/>)
        }
    </td>;
}