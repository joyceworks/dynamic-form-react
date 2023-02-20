import React from "react";
import { Form } from "antd";
import CellLabelConfig from "../../../../Config/CellLabelConfig";
import CellRequiredConfig from "../../../../Config/CellRequiredConfig";
import CellReadonlyConfig from "../../../../Config/CellReadonlyConfig";
import CellOptionsConfig from "../../../../Config/CellOptionsConfig";
import { SelectCellData } from "../schema";
import { labelCol } from "../../../../constant";

interface SelectCellConfigProps {
  data: SelectCellData;
}

export default function SelectCellConfig({
  data,
}: SelectCellConfigProps): JSX.Element {
  return (
    <>
      <Form labelCol={labelCol}>
        <CellLabelConfig data={data} />
        <CellRequiredConfig data={data} />
        <CellReadonlyConfig data={data} />
        <CellOptionsConfig data={data} />
      </Form>
    </>
  );
}
