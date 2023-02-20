import React from "react";
import CellEnumPropConfig from "./CellEnumPropConfig";
import { InputCellData } from "../Designer/Cell/InputCell/schema";

const options = [
  {
    value: "none",
    label: "None",
  },
  {
    value: "mobile",
    label: "Mobile",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "custom",
    label: "Custom",
  },
];

const CellFormatConfig = ({ data }: { data: InputCellData }): JSX.Element => {
  return (
    <CellEnumPropConfig
      options={options}
      data={data}
      label={"格式"}
      prop={"format"}
    />
  );
};

export default CellFormatConfig;
