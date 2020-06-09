import React, { forwardRef } from "react";
import { Input } from "antd";
import { CellData } from "../schemas/CellData";
import { FormGroup } from "./FormGroup";
interface TextAreaCellProps {
  element: CellData;
  layout?: "vertical" | "horizontal";
  dispatch: any;
}

const { TextArea } = Input;

export const TextAreaCell = forwardRef(
  ({ element: data, layout, dispatch }: TextAreaCellProps, ref: any) => (
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
          <TextArea
            rows={4}
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
