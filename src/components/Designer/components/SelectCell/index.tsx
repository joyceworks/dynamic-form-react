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
  ({ cellData, layout, dispatch }: SelectCellProps, ref: any) => {
    if (!cellData.options || cellData.options.length === 0) {
      cellData.options = [
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
          required={cellData.required!}
          warning={cellData.warning}
          layout={layout}
          warnable={cellData.warnable!}
          label={
            cellData.labeled ? (
              <label title={cellData.label}>{cellData.label}</label>
            ) : (
              <></>
            )
          }
          element={
            <Select
              onChange={(value) => {
                dispatch({
                  type: "SET_VALUE",
                  target: cellData,
                  value: value,
                });
              }}
            >
              {cellData.options?.map((option) => (
                <Option value={option.value}>{option.label}</Option>
              ))}
            </Select>
          }
        />
      </>
    );
  }
);
