import React, { forwardRef } from "react";
import { Input } from "antd";
import { CellData } from "./Designer/schemas/CellData";
import { FormGroup } from "./Designer/components/FormGroup";
interface TextAreaCellProps {
  data: CellData;
  layout?: "vertical" | "horizontal";
  dispatch: any;
}

const { TextArea } = Input;

export const TextAreaCell = forwardRef(
  ({ data, layout, dispatch }: TextAreaCellProps, ref: any) => {
    const innerData = { ...data };
    innerData.label = innerData.label || "多行文本";
    return (
      <>
        <FormGroup
          ref={ref}
          required={innerData.required!}
          warning={innerData.warning}
          layout={layout}
          warnable={innerData.warnable!}
          label={
            innerData.labeled ? (
              <label title={innerData.label}>{innerData.label}</label>
            ) : (
              <></>
            )
          }
          element={
            <TextArea
              rows={4}
              value={innerData.value}
              placeholder={innerData.placeholder}
              disabled={innerData.disabled}
              onChange={(event) => {
                dispatch &&
                  dispatch({
                    type: "SET_VALUE",
                    target: innerData,
                    value: event.target.value,
                  });
              }}
            />
          }
        />
      </>
    );
  }
);
