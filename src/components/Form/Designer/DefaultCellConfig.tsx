import React, { useContext } from "react";
import { CellData } from "../schema";
import { DesignerContext } from "./index";
import { Input, Switch, Form } from "antd";
import update from "immutability-helper";

interface SelectWrapperCellConfigProps {
  data: CellData;
}

export default function DefaultCellConfig({
  data,
}: SelectWrapperCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  const innerData = { ...data };
  innerData.label = innerData.label || "自定义控件";
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
