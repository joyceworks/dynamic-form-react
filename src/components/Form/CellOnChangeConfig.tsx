import React from "react";
import { CellData } from "./schema";
import CellTextPropConfig from "./CellTextPropConfig";

const CellOnChangeConfig = ({ data }: { data: CellData }): JSX.Element => {
  return (
    <CellTextPropConfig data={data} label={"OnChange"} prop={"rawOnChange"} />
  );
};

export default CellOnChangeConfig;
