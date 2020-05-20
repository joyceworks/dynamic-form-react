import React, { forwardRef, useContext } from "react";
import { DesignerContext } from "../../../../../../index";
import { CellData } from "../../../../../../schemas/CellData";
import { DnDCell } from "../../../../../DnDCell";
import { Cell } from "../../../../../Cell";

interface LaneProps {
  cellDataList: CellData[];
  direction: "column" | "row";
  className?: string;
}

export const Lane = forwardRef(
  ({ cellDataList, direction, className }: LaneProps, ref: any) => {
    const designerDispatch = useContext(DesignerContext);
    const layout = direction === "column" ? "default" : "inline";
    const cells = cellDataList.map((child, index) =>
      designerDispatch ? (
        <DnDCell
          key={child.id}
          layout={layout}
          cellData={child}
          index={index}
        />
      ) : (
        <Cell cellData={child} key={child.id} layout={layout} />
      )
    );

    return (
      <td ref={ref} className={"lane " + direction + (className || "")}>
        {cells}
      </td>
    );
  }
);
