import React from "react";
import {Input} from "antd";
import {FormGroup} from "../../FormGroup";
import {Element} from "../../../schemas/Element";


interface InputCellProps {
    element: Element;
    layout?: 'inline' | 'default';
    dispatch: any;
}

export const InputCell = function ({element, layout, dispatch}: InputCellProps) {
    return <>
        <FormGroup required={element.required!} warning={element.warning} layout={layout}
                   warningable={element.warningable!}
                   label={
                       element.labeled ?
                           <label title={element.label}>{element.label}</label> : <></>
                   }
                   element={
                       <Input value={element.value} placeholder={element.placeholder}
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