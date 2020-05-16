import React, { forwardRef } from "react";
import { Pool } from "./components/Pool";
import { CellData } from "../../../../schemas/CellData";

interface GridCellProps {
  element: CellData;
}

export const GridCell = forwardRef(({ element }: GridCellProps, ref: any) => {
  return (
    <>
      <Pool ref={ref} cellData={element} />
    </>
  );
});
