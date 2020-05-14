import React, { forwardRef } from "react";
import { Grid } from "../../../Grid";
import { CellData } from "../../../../schemas/CellData";

interface GridCellProps {
  element: CellData;
}

export const GridCell = forwardRef(({ element }: GridCellProps, ref: any) => {
  return (
    <>
      <Grid ref={ref} cellData={element} />
    </>
  );
});
