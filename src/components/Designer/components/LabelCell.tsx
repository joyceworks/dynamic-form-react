import React, { forwardRef } from "react";
import { CellData } from "../schemas/CellData";

interface LabelCellProps {
  data: CellData;
  layout?: "vertical" | "horizontal";
  dispatch: any;
}

export const LabelCell = forwardRef(({ data }: LabelCellProps, ref: any) => (
  <div style={{ height: 42, padding: "0 10px" }}>
    <label style={{ lineHeight: "42px" }} title={data.label}>
      {data.label || " "}
    </label>
  </div>
));
