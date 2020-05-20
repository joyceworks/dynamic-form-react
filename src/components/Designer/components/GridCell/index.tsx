import React, { forwardRef } from "react";
import { Pool } from "./components/Pool";
import { CellData } from "../../schemas/CellData";

interface GridCellProps {
  element: CellData;
  direction?: "column" | "row";
}

export const GridCell = forwardRef(
  ({ element, direction }: GridCellProps, ref: any) => {
    return (
      <>
        <Pool ref={ref} cellData={element} direction={direction} />
      </>
    );
  }
);
