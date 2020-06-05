import React, { useContext } from "react";
import { CellData } from "../../schemas/CellData";
import { DesignerContext } from "../../index";
import { Input, Switch, Form } from "antd";
import update from "immutability-helper";

interface SelectCellConfigProps {
  data: CellData;
}

export default function SelectCellConfig({ data }: SelectCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  return (
    <>
      <Form>
        <Form.Item label={"标题"}>
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
        <Form.Item label={"必填"}>
          <Switch
            checked={data.required}
            onChange={(checked) => {
              designerDispatch({
                type: "UPDATE",
                data: update(data, {
                  required: { $set: checked },
                }),
              });
            }}
          />
        </Form.Item>
        <Form.Item label={"只读"}>
          <Switch
            checked={data.disabled}
            onChange={(checked) => {
              designerDispatch({
                type: "UPDATE",
                data: update(data, {
                  disabled: { $set: checked },
                }),
              });
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
}
