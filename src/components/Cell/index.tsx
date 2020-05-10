import React, {useContext} from "react";
import {Element} from '../../schemas/Element';
import {DynamicFormContext} from "../DynamicForm";
import {InputCell} from "./components/InputCell";
import {GridCell} from "./components/GridCell";

interface CellProps {
    element: Element;
    layout?: 'inline' | 'default';
}

export const Cell = function ({element, layout}: CellProps) {
    const data = {
        ...element,
        required: false,
        warningable: false,
        layout: 'default',
        labeled: true
    };
    const dispatch = useContext(DynamicFormContext);
    if (element.type === 'input') {
        return <InputCell element={data} dispatch={dispatch} layout={layout}/>;
    } else if (element.type === 'indicator') {
        return <div className={'indicator'}/>;
    } else if (element.type === 'grid') {
        return <GridCell element={data}/>
    } else {
        return <></>;
    }
}