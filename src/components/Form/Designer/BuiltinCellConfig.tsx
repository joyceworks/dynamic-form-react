import React, { useContext } from "react";
import { CellData } from "../schema";
import { DesignerContext } from "./index";
import { Form, Input, Switch } from "antd";
import update from "immutability-helper";

interface BuiltinCellConfigProps {
  data: CellData;
}

export default function BuiltinCellConfig({ data }: BuiltinCellConfigProps) {
  // todo: can not cancel required

  const designerDispatch = useContext(DesignerContext);
  const innerData = { ...data };
  innerData.label = innerData.label || "自定义控件";
  return (
    <>
      <Form labelCol={{ span: 8 }}>
        <Form.Item label={"Title"}>
          <Input
            value={innerData.label}
            onChange={(event) => {
              designerDispatch({
                type: "UPDATE",
                data: update(innerData, {
                  label: { $set: event.target.value },
                }),
              });
            }}
          />
        </Form.Item>
        <Form.Item label={"Required"}>
          <Switch
            disabled={!!innerData.required}
            checked={!!innerData.required}
            onChange={(checked) => {
              designerDispatch({
                type: "UPDATE",
                data: update(innerData, {
                  required: { $set: checked },
                }),
              });
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
}
