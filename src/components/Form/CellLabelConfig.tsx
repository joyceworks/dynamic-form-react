import React from "react";
import { CellData } from "./schema";
import CellTextPropConfig from "./CellTextPropConfig";

const CellLabelConfig = ({ data }: { data: CellData }): JSX.Element => {
  return <CellTextPropConfig data={data} label={"标题"} prop={"label"} />;
};

export default CellLabelConfig;
