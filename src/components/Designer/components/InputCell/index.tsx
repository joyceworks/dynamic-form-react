import React, { forwardRef } from "react";
import { Input } from "antd";
import { CellData } from "../../schemas/CellData";
import { FormGroup } from "../FormGroup";

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
        warnable={element.warnable!}
        label={
          element.labeled ? (
            <label title={element.label}>{element.label}</label>
          ) : (
            <></>
          )
        }
        element={
          <Input
            disabled={element.disabled}
            value={element.value}
            placeholder={element.placeholder}
            onChange={(event) => {
              dispatch &&
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
