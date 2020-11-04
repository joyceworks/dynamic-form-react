import React, { forwardRef } from "react";
import { Select } from "antd";
import { FormGroup } from "./FormGroup";
import { CellProps } from "../schema";

const { Option } = Select;

export const SelectCell = forwardRef(
  ({ data, layout, onChange }: CellProps, ref: any) => {
    return (
      <>
        <FormGroup
          ref={ref}
          required={!!data.required!}
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
            <Select
              placeholder={data.placeholder}
              disabled={data.disabled}
              style={{ width: "100%" }}
              onChange={(value) => onChange(value)}
            >
              {data.options?.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          }
        />
      </>
    );
  }
);
