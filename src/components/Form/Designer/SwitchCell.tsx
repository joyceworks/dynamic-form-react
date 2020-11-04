import React, { forwardRef } from "react";
import { Switch } from "antd";
import { CellProps } from "../schema";
import { FormGroup } from "./FormGroup";

export const SwitchCell = forwardRef(
  ({ data, layout, onChange }: CellProps, ref: any) => (
    <>
      <FormGroup
        ref={ref}
        required={typeof data.required === "function" ? true : data.required}
        warning={data.warning}
        layout={layout}
        warnable={data.warnable!}
        label={
          data.labeled ? <label title={data.label}>{data.label}</label> : <></>
        }
        element={
          <Switch
            checked={data.value}
            onChange={(checked) => onChange(checked)}
            disabled={data.disabled}
          />
        }
      />
    </>
  )
);
