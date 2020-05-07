import React, {useContext} from "react";
import {DynamicFormContext} from "../DynamicForm";

interface CellProps {
}

export const Cell = function (props: CellProps) {
    const dispatch = useContext(DynamicFormContext);
    return <>
        <button onClick={() => dispatch({
            type: 'SET_CURRENT',
            element: 'Hi'
        })}>Context test</button>
    </>;
}