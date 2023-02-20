import React, { useCallback, useMemo } from "react";
import { Input } from "antd";
import { CellProps } from "../../../schema";
import { FormGroup } from "../../FormGroup";

const InputCell = ({ data, layout, onChange }: CellProps): JSX.Element => {
  const label = useMemo(
    () =>
      data.labeled ? <label title={data.label}>{data.label}</label> : <></>,
    [data.label, data.labeled]
  );

  const handleChange = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const element = useMemo(
    () => (
      <Input
        disabled={data.disabled}
        value={data.value as string}
        placeholder={data.placeholder}
        onChange={handleChange}
      />
    ),
    [data.disabled, data.placeholder, data.value, handleChange]
  );

  return (
    <>
      <FormGroup
        required={typeof data.required === "function" ? true : data.required}
        warning={data.warning}
        layout={layout}
        warnable={data.warnable}
        label={label}
        element={element}
      />
    </>
  );
};
export default InputCell;
