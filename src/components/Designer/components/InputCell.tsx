import React, { forwardRef } from "react";
import { Input } from "antd";
import { CellData } from "../schemas/CellData";
import { FormGroup } from "./FormGroup";

interface InputCellProps {
  element: CellData;
  layout?: "inline" | "default";
  dispatch: any;
}

export const InputCell = forwardRef(
  ({ element: data, layout, dispatch }: InputCellProps, ref: any) => (
    <>
      <FormGroup
        ref={ref}
        required={data.required!}
        warning={data.warning}
        layout={layout}
        warnable={data.warnable!}
        label={
          data.labeled ? <label title={data.label}>{data.label}</label> : <></>
        }
        element={
          <Input
            disabled={data.disabled}
            value={data.value}
            placeholder={data.placeholder}
            onChange={(event) => {
              dispatch &&
                dispatch({
                  type: "SET_VALUE",
                  target: data,
                  value: event.target.value,
                });
            }}
          />
        }
      />
    </>
  )
);
