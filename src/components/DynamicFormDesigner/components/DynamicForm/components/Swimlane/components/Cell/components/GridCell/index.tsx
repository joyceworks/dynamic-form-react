import React, {forwardRef} from "react";
import {DynamicForm} from "../../../../../../index";
import {CellData} from "../../../../../../../../schemas/CellData";


interface GridCellProps {
    element: CellData;
}

export const GridCell = forwardRef(({element}: GridCellProps, ref: any) => {
    return <>
        <DynamicForm ref={ref} element={element}/>
    </>;
})