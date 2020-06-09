import React, { forwardRef } from "react";
import { CellData } from "../../schemas/CellData";
import { Select } from "antd";
import { FormGroup } from "../FormGroup";

const { Option } = Select;

interface SelectCellProps {
  cellData: CellData;
  layout?: "inline" | "default";
  dispatch: any;
}

export const SelectCell = forwardRef(
  ({ cellData: data, layout, dispatch }: SelectCellProps, ref: any) => {
    if (!data.options || data.options.length === 0) {
      data.options = [
        {
          label: "Joyce",
          value: "1",
        },
        {
          label: "Teresa",
          value: "2",
        },
      ];
    }
    return (
      <>
        <FormGroup
          ref={ref}
          required={data.required!}
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
              onChange={(value) => {
                dispatch &&
                  dispatch({
                    type: "SET_VALUE",
                    target: data,
                    value: value,
                  });
              }}
            >
              {data.options?.map((option) => (
                <Option value={option.value}>{option.label}</Option>
              ))}
            </Select>
          }
        />
      </>
    );
  }
);
