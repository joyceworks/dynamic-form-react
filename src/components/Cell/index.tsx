import React, {useContext} from "react";
import Element from '../../schemas/Element';
import {DynamicFormContext} from "../DynamicForm";
import {Input} from "antd";
import {FormGroup} from "../FormGroup";

interface CellProps {
    element: Element;
}

export const Cell = function ({element}: CellProps) {
    const dispatch = useContext(DynamicFormContext);
    return <>
        <FormGroup required={element.required} warning={element.warning} layout={element.layout}
                   warningable={element.warningable}
                   label={
                       element.labeled ?
                           <label title={element.label}>{element.label}</label> : <></>
                   }
                   element={
                       <Input value={element.value} placeholder={element.placeholder}
                              onChange={(event) => {
                                  dispatch({
                                      type: 'SET_VALUE',
                                      value: event.currentTarget.value
                                  });
                              }}
                       />
                   }
        />
        {/*<button onClick={() => dispatch({*/}
        {/*    type: 'SET_CURRENT',*/}
        {/*    element: 'Hi'*/}
        {/*})}>Context test*/}
        {/*</button>*/}
    </>;
}