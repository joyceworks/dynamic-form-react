import React, { useContext } from "react";
import { CellData } from "../Form/schema";
import { DesignerContext } from "../Form/Designer";
import { Input, Form } from "antd";
import update from "immutability-helper";

interface LabelCellConfigProps {
  data: CellData;
}

export default function LabelCellConfig({ data }: LabelCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  return (
    <>
      <Form labelCol={{ span: 8 }}>
        <Form.Item label={"Title"}>
          <Input
            value={data.label}
            onChange={(event) => {
              designerDispatch({
                type: "UPDATE",
                data: update(data, {
                  label: { $set: event.target.value },
                }),
              });
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
}
