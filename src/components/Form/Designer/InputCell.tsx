import React, { forwardRef } from "react";
import { Input } from "antd";
import { CellProps } from "../schema";
import { FormGroup } from "./FormGroup";

export const InputCell = forwardRef(
  ({ data, layout, onChange }: CellProps, ref: any) => {
    return (
      <>
        <FormGroup
          ref={ref}
          required={typeof data.required === "function" ? true : data.required}
          warning={data.warning}
          layout={layout}
          warnable={data.warnable!}
          label={
            data.labeled ? (
              <label title={data.label}>{data.label}</label>
            ) : (
              <></>
            )
          }
          element={
            <Input
              disabled={data.disabled}
              value={data.value}
              placeholder={data.placeholder}
              onChange={(event) => {
                onChange(event.target.value);
              }}
            />
          }
        />
      </>
    );
  }
);
