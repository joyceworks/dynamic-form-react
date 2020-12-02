import React, { forwardRef } from "react";
import { Pool } from "./Pool";
import { CellData } from "../../../schema";
import { CustomCell } from "../index";

interface GridCellProps {
  data: CellData;
  direction?: "horizontal" | "vertical";
  customCells?: CustomCell[];
}

export const GridCell = forwardRef(
  ({ data, direction, customCells }: GridCellProps, ref: any) => {
    return (
      <>
        <Pool
          ref={ref}
          cellData={data}
          direction={direction}
          customCells={customCells}
        />
      </>
    );
  }
);
