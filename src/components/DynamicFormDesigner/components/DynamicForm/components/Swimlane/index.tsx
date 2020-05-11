import {Cell} from "./components/Cell";
import React, {useContext} from "react";
import {CellData} from "../../../../schemas/CellData";
import {useDrop} from "react-dnd";
import {createWidgetInstance} from "../../../../util";
import {DynamicFormDesignerContext} from "../../../../index";

interface SwimlaneProps {
    elements: CellData[];
    direction: 'column' | 'row';
}

export const Swimlane = function ({elements, direction}: SwimlaneProps) {
    const dispatch = useContext(DynamicFormDesignerContext);
    const [{isOver}, drop] = useDrop({
        accept: ['input', 'grid'],
        drop: item => {
            if (isOver) {
                dispatch({
                    type: 'ADD',
                    cellData: createWidgetInstance(item.type as string),
                    cellDataList: elements,
                });
            }
        },
        collect: monitor => ({isOver: !!monitor.isOver()})
    });

    const layout = direction === 'column' ? 'default' : 'inline';
    return <td className={'swimlane ' + direction} ref={drop}>
        {
            elements.map((child, index) =>
                <Cell key={child.id} layout={layout} cellData={child} index={index}/>)
        }
    </td>;
}