import React, {useContext} from "react";
import {Element} from '../../schemas/Element';
import {DynamicFormContext} from "../DynamicForm";
import {Input} from "antd";
import {FormGroup} from "../FormGroup";

interface CellProps {
    element: Element;
    layout?: 'inline' | 'default';
}

export const Cell = function ({element, layout}: CellProps) {
    const data = {...element, required: false, warningable: false, layout: 'default'};
    const dispatch = useContext(DynamicFormContext);
    return <>
        <FormGroup required={data.required} warning={data.warning} layout={layout}
                   warningable={data.warningable}
                   label={
                       data.labeled ?
                           <label title={data.label}>{data.label}</label> : <></>
                   }
                   element={
                       <Input value={data.value} placeholder={data.placeholder}
                              onChange={(event) => {
                                  dispatch({
                                      type: 'SET_VALUE',
                                      target: element,
                                      value: event.target.value
                                  });
                              }}
                       />
                   }
        />
    </>;
}