import React, { useCallback, useEffect, useState } from "react";
import { CellData } from "../schema";
import { Form, Input } from "antd";
import { useCellDataProp } from "../hooks";

const CellIdConfig = ({ data }: { data: CellData }): JSX.Element => {
  const { update } = useCellDataProp(data, "id");
  const [internalValue, setInternalValue] = useState(data["id"]);
  const handleChange = useCallback((event) => {
    setInternalValue(event.target.value);
  }, []);
  useEffect(() => {
    setInternalValue(data["id"]);
  }, [data]);
  const handleBlur = useCallback(
    (event) => {
      if (!event.target.value) {
        return;
      }
      update(event.target.value);
    },
    [update]
  );
  return (
    <Form.Item label={"ID"}>
      <Input
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Form.Item>
  );
};

export default CellIdConfig;
