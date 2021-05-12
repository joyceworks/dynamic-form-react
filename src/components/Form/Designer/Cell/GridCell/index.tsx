import React from "react";
import { Pool } from "./Pool";
import { CustomCell } from "../index";
import { LanedCellData } from "../../../schema";

interface GridCellProps {
  data: LanedCellData;
  direction?: "horizontal" | "vertical";
  customCells?: CustomCell[];
}

export const GridCell = ({
  data,
  direction,
  customCells,
}: GridCellProps): JSX.Element => {
  return (
    <Pool cellData={data} direction={direction} customCells={customCells} />
  );
};
