import React, { forwardRef } from "react";
import { DatePicker } from "antd";
import { FormGroup } from "./FormGroup";
import { CellProps } from "../schema";
import moment from "moment";

export const DateCell = forwardRef(
  ({ data, layout, onChange }: CellProps, ref: any) => (
    <>
      <FormGroup
        ref={ref}
        required={!!data.required}
        warning={data.warning}
        layout={layout}
        warnable={data.warnable!}
        label={
          data.labeled ? <label title={data.label}>{data.label}</label> : <></>
        }
        element={
          <DatePicker
            style={{ width: "100%" }}
            disabled={data.disabled}
            value={data.value ? moment(data.value) : null}
            placeholder={data.placeholder}
            onChange={(date) =>
              onChange(date ? date.format("YYYY-MM-DD HH:mm:ss") : null)
            }
          />
        }
      />
    </>
  )
);
