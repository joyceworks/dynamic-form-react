import React, { forwardRef } from "react";
import { Pool } from "./components/Pool";
import { CellData } from "../../schemas/CellData";

interface GridCellProps {
  data: CellData;
  direction?: "horizontal" | "vertical";
}

export const GridCell = forwardRef(
  ({ data, direction }: GridCellProps, ref: any) => {
    return (
      <>
        <Pool ref={ref} cellData={data} direction={direction} />
      </>
    );
  }
);
