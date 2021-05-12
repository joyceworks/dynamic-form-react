import CellBooleanPropConfig from "./CellBooleanPropConfig";
import React from "react";
import { CellData } from "./schema";

const CellUniqueConfig = ({ data }: { data: CellData }): JSX.Element => {
  return <CellBooleanPropConfig data={data} prop={"unique"} label={"Unique"} />;
};

export default CellUniqueConfig;
