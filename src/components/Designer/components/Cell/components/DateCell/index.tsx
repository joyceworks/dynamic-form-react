import React, { forwardRef } from "react";
import { Input, DatePicker } from "antd";
import { FormGroup } from "../FormGroup";
import { CellData } from "../../../../schemas/CellData";

interface DateCellProps {
  data: CellData;
  layout?: "inline" | "default";
  dispatch: any;
}

export const DateCell = forwardRef(
  ({ data, layout, dispatch }: DateCellProps, ref: any) => (
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
          <DatePicker
            style={{ width: "100%" }}
            value={data.value}
            placeholder={data.placeholder}
            onChange={(date) => {
              dispatch({
                type: "SET_VALUE",
                target: data,
                value: date,
              });
            }}
          />
        }
      />
    </>
  )
);
