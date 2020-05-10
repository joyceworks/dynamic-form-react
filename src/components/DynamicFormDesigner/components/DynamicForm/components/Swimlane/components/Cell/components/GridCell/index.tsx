import React from "react";
import {DynamicForm} from "../../../../../../index";
import {CellData} from "../../../../../../../../schemas/CellData";


interface GridCellProps {
    element: CellData;
}

export const GridCell = function ({element}: GridCellProps) {
    return <>
        <DynamicForm element={element}/>
    </>;
}