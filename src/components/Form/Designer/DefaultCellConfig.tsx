import React from "react";
import { CellData } from "../schema";
import { Form } from "antd";
import CellLabelConfig from "../Config/CellLabelConfig";
import CellRequiredConfig from "../Config/CellRequiredConfig";
import CellReadonlyConfig from "../Config/CellReadonlyConfig";
import CellDefaultConfig from "../Config/CellDefaultConfig";
import CellIdConfig from "../Config/CellIdConfig";
import CellOnChangeConfig from "../Config/CellOnChangeConfig";
import { labelCol } from "../constant";

interface SelectWrapperCellConfigProps {
  data: CellData;
}

export default function DefaultCellConfig({
  data,
}: SelectWrapperCellConfigProps): JSX.Element {
  const innerData = { ...data };
  innerData.label = innerData.label || "自定义控件";
  return (
    <>
      <Form labelCol={labelCol}>
        <CellIdConfig data={innerData} />
        <CellLabelConfig data={innerData} />
        <CellRequiredConfig data={data} />
        <CellReadonlyConfig data={data} />
        <CellDefaultConfig data={data} />
        <CellOnChangeConfig data={data} />
      </Form>
    </>
  );
}
