import React from "react";
import { Form } from "antd";
import CellLabelConfig from "../../../Config/CellLabelConfig";
import CellRequiredConfig from "../../../Config/CellRequiredConfig";
import CellReadonlyConfig from "../../../Config/CellReadonlyConfig";
import CellDefaultConfig from "../../../Config/CellDefaultConfig";
import CellCustomFormatConfig from "../../../Config/CellCustomFormatConfig";
import CellFormatConfig from "../../../Config/CellFormatConfig";
import { InputCellData } from "./schema";
import { labelCol } from "../../../constant";
import CellUniqueConfig from "../../../Config/CellUniqueConfig";
import CellIdConfig from "../../../Config/CellIdConfig";
import CellOnChangeConfig from "../../../Config/CellOnChangeConfig";

interface InputCellConfigProps {
  data: InputCellData;
}

export default function InputCellConfig({
  data,
}: InputCellConfigProps): JSX.Element {
  const innerData: InputCellData = { ...data };
  innerData.label = innerData.label || "自定义控件";
  return (
    <>
      <Form labelCol={labelCol}>
        <CellIdConfig data={innerData} />
        <CellLabelConfig data={innerData} />
        <CellRequiredConfig data={innerData} />
        <CellReadonlyConfig data={innerData} />
        <CellUniqueConfig data={innerData} />
        <CellDefaultConfig data={innerData} />
        <CellFormatConfig data={innerData} />
        {innerData.format === "custom" && (
          <CellCustomFormatConfig data={innerData} />
        )}
        <CellOnChangeConfig data={data} />
      </Form>
    </>
  );
}
