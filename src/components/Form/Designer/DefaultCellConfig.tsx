import React from "react";
import { CellData } from "../schema";
import { Form } from "antd";
import CellLabelConfig from "../CellLabelConfig";
import CellRequiredConfig from "../CellRequiredConfig";
import CellReadonlyConfig from "../CellReadonlyConfig";
import CellDefaultConfig from "../CellDefaultConfig";
import { labelCol } from "./constant";
import CellIdConfig from "../CellIdConfig";
import CellOnChangeConfig from "../CellOnChangeConfig";

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
