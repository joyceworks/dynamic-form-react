import { Form, Input } from "antd";
import React, { useCallback, useState } from "react";
import { CellData } from "../schema";
import { useCellDataProp } from "../hooks";

const CellTextPropConfig = ({
  data,
  label,
  prop,
  onChange,
}: {
  data: CellData;
  prop: string;
  label: string;
  onChange?: (value?: string) => void;
}): JSX.Element => {
  const { update } = useCellDataProp(data, prop);
  const [internalValue, setInternalValue] = useState(data[prop]);
  const handleChange = useCallback((event) => {
    setInternalValue(event.target.value);
  }, []);
  const handleBlur = useCallback(
    (event) => {
      update(event.target.value);
      onChange?.(event.target.value);
    },
    [onChange, update]
  );
  return (
    <Form.Item label={label}>
      <Input
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Form.Item>
  );
};

export default CellTextPropConfig;
