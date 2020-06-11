import React from "react";
import { CellData } from "../schemas/CellData";
import { FormGroup } from "./FormGroup";
import { Checkbox } from "antd";

interface CheckboxCellProps {
  data: CellData;
  layout?: "vertical" | "horizontal";
  dispatch: any;
}

export default function ({ data, layout, dispatch }: CheckboxCellProps) {
  return (
    <>
      <FormGroup
        required={data.required}
        warnable={data.warnable}
        label={<label>{data.label}</label>}
        element={
          <>
            <Checkbox.Group
              options={data.options}
              onChange={(checkedValues) => {
                console.log(checkedValues);
              }}
            />
          </>
        }
      />
    </>
  );
}
