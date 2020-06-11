import React, { useContext } from "react";
import { CellData } from "../schemas/CellData";
import { DesignerContext } from "../index";
import { Input, Switch, Form } from "antd";
import update from "immutability-helper";

interface LabelCellConfigProps {
  data: CellData;
}

export default function LabelCellConfig({ data }: LabelCellConfigProps) {
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
      </Form>
    </>
  );
}
