import React from "react";
import { CellData } from "../../../schema";
import { Form } from "antd";
import CellLabelConfig from "../../../Config/CellLabelConfig";
import { labelCol } from "../../../constant";

interface LabelCellConfigProps {
  data: CellData;
}

export default function LabelCellConfig({
  data,
}: LabelCellConfigProps): JSX.Element {
  return (
    <>
      <Form labelCol={labelCol}>
        <CellLabelConfig data={data} />
      </Form>
    </>
  );
}
