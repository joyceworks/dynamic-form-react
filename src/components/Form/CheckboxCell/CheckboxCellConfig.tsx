import React from "react";
import { Form } from "antd";
import CellLabelConfig from "../CellLabelConfig";
import CellRequiredConfig from "../CellRequiredConfig";
import CellReadonlyConfig from "../CellReadonlyConfig";
import CellOptionsConfig from "../CellOptionsConfig";
import { labelCol } from "../Designer/constant";
import { SelectCellData } from "../SelectCell/schema";

interface CheckboxCellConfigProps {
  data: SelectCellData;
}

export default function CheckboxCellConfig({
  data,
}: CheckboxCellConfigProps): JSX.Element {
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
