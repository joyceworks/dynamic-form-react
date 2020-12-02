import React, { forwardRef } from "react";
import { CellProps } from "../Form/schema";

export const LabelCell = forwardRef(({ data }: CellProps, ref: any) => (
  <div style={{ height: 42, padding: "0 10px" }} ref={ref}>
    <label style={{ lineHeight: "42px" }} title={data.label}>
      {data.label || " "}
    </label>
  </div>
));
