import React, { useContext } from "react";
import { CellData } from "../../schemas/CellData";
import { DesignerContext } from "../../index";
import { Input } from "antd";
import { FormGroup } from "../FormGroup";
import update from "immutability-helper";

interface InputCellConfigProps {
  data: CellData;
}

export default function InputCellConfig({ data }: InputCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  return (
    <>
      <FormGroup
        layout={"inline"}
        required={false}
        warnable={false}
        label={<label>标题</label>}
        element={
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
        }
      />
    </>
  );
}
