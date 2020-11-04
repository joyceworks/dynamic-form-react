import React, { useContext } from "react";
import { CellData } from "../schema";
import { DesignerContext } from "./index";
import { Input, Form } from "antd";
import update from "immutability-helper";

interface LabelCellConfigProps {
  data: CellData;
}

export default function LabelCellConfig({ data }: LabelCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  return (
    <>
      <Form labelCol={{ span: 6 }}>
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
