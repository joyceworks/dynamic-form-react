import React, { forwardRef } from "react";
import { Grid } from "../../../Grid/index";
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
