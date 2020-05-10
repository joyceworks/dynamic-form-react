import {Cell} from "./components/Cell";
import React from "react";
import {CellData} from "../../../../schemas/CellData";
import {useDrop} from "react-dnd";
import {createWidgetInstance} from "../../../../util";

interface SwimlaneProps {
    elements: CellData[];
    direction: 'column' | 'row';
}

export const Swimlane = function ({elements, direction}: SwimlaneProps) {
    const [{isOver}, drop] = useDrop({
        accept: ['input', 'grid'],
        drop: item => {
            if (isOver) {
                elements.push(createWidgetInstance(item.type as string));
            }
        },
        collect: monitor => ({isOver: !!monitor.isOver()})
    });

    const layout = direction === 'column' ? 'default' : 'inline';
    return <td className={'swimlane ' + direction} ref={drop}>
        {
            elements.map(child => <Cell key={child.id} layout={layout} element={child}/>)
        }
    </td>;
}