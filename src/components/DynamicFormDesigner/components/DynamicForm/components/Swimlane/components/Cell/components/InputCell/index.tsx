import React, { forwardRef } from "react";
import { Input } from "antd";
import { FormGroup } from "../FormGroup";
import { CellData } from "../../../../../../../../schemas/CellData";

interface InputCellProps {
  element: CellData;
  layout?: "inline" | "default";
  dispatch: any;
}

export const InputCell = forwardRef(
  ({ element, layout, dispatch }: InputCellProps, ref: any) => (
    <>
      <FormGroup
        ref={ref}
        required={element.required!}
        warning={element.warning}
        layout={layout}
        warningable={element.warningable!}
        label={
          element.labeled ? (
            <label title={element.label}>{element.label}</label>
          ) : (
            <></>
          )
        }
        element={
          <Input
            value={element.value}
            placeholder={element.placeholder}
            onChange={(event) => {
              dispatch({
                type: "SET_VALUE",
                target: element,
                value: event.target.value,
              });
            }}
          />
        }
      />
    </>
  )
);
