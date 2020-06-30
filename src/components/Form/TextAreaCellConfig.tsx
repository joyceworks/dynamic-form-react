import React, { useContext } from "react";
import { CellData } from "./Designer/schemas/CellData";
import { DesignerContext } from "./Designer";
import { Input, Switch, Form } from "antd";
import update from "immutability-helper";

interface TextAreaCellConfigProps {
  data: CellData;
}

export default function TextAreaCellConfig({ data }: TextAreaCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  const innerData = { ...data };
  innerData.label = innerData.label || "多行文本";
  return (
    <>
      <Form labelCol={{ span: 6 }}>
        <Form.Item label={"标题"}>
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
        <Form.Item label={"必填"}>
          <Switch
            checked={innerData.required}
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
        <Form.Item label={"只读"}>
          <Switch
            checked={innerData.disabled}
            onChange={(checked) => {
              designerDispatch({
                type: "UPDATE",
                data: update(innerData, {
                  disabled: { $set: checked },
                }),
              });
            }}
          />
        </Form.Item>
        <Form.Item label={"默认值"}>
          <Input
            value={innerData.defaultValue}
            onChange={(event) => {
              designerDispatch({
                type: "UPDATE",
                data: update(innerData, {
                  defaultValue: { $set: event.target.value },
                }),
              });
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
}
