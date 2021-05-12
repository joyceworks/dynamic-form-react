import React from "react";
import { Form } from "antd";
import CellLabelConfig from "../CellLabelConfig";
import CellRequiredConfig from "../CellRequiredConfig";
import CellReadonlyConfig from "../CellReadonlyConfig";
import CellDefaultConfig from "../CellDefaultConfig";
import CellCustomFormatConfig from "../CellCustomFormatConfig";
import CellFormatConfig from "../CellFormatConfig";
import { InputCellData } from "./schema";
import { labelCol } from "../Designer/constant";
import CellUniqueConfig from "../CellUniqueConfig";
import CellIdConfig from "../CellIdConfig";
import CellOnChangeConfig from "../CellOnChangeConfig";

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
