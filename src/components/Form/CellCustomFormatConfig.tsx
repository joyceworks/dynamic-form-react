import React from "react";
import CellTextPropConfig from "./CellTextPropConfig";
import { InputCellData } from "./InputCell/schema";

const CellCustomFormatConfig = ({
  data,
}: {
  data: InputCellData;
}): JSX.Element => {
  return (
    <CellTextPropConfig
      data={data}
      label={"自定义格式"}
      prop={"customFormat"}
    />
  );
};

export default CellCustomFormatConfig;
