import React, { forwardRef, useCallback, useMemo } from "react";
import { FormGroup } from "../../FormGroup";
import { CellProps } from "../../../schema";
import dayjs from "dayjs";
import DatePicker from "../../../../DatePicker";

const elementStyle = { width: "100%" };

export const DateCell = forwardRef(
  ({ data, layout, onChange }: CellProps, ref: any) => {
    const handleChange = useCallback(
      (date) => onChange(date ? date.format("YYYY-MM-DD HH:mm:ss") : null),
      [onChange]
    );

    const label = useMemo(
      () =>
        data.labeled ? <label title={data.label}>{data.label}</label> : <></>,
      [data.label, data.labeled]
    );

    return (
      <>
        <FormGroup
          ref={ref}
          required={!!data.required}
          warning={data.warning}
          layout={layout}
          warnable={data.warnable!}
          label={label}
          element={
            <DatePicker
              style={elementStyle}
              disabled={data.disabled}
              value={data.value ? dayjs(data.value as string) : null}
              placeholder={data.placeholder}
              onChange={handleChange}
            />
          }
        />
      </>
    );
  }
);
