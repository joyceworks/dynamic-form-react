import React from "react";
import {Element} from "../../../../schemas/Element";
import {DynamicForm} from "../../../DynamicForm";


interface GridCellProps {
    element: Element;
}

export const GridCell = function ({element}: GridCellProps) {
    return <>
        <DynamicForm element={element}/>
    </>;
}