import React, { forwardRef, useContext } from "react";
import { CellData } from "../../../../../../schemas/CellData";
import { DnDCell } from "../../../../../DnDCell";
import { Cell } from "../../../../../Cell";
import { InstanceContext } from "../../../../../../../Instance";
import { Col } from "antd";

interface LaneProps {
  cellDataList: CellData[];
  direction: "column" | "row";
  className?: string;
  span?: number;
}

export const Lane = forwardRef(
  ({ cellDataList, direction, className, span }: LaneProps, ref: any) => {
    const instanceDispatch = useContext(InstanceContext);
    const layout = direction === "column" ? "default" : "inline";
    const cells = cellDataList.map((child, index) =>
      instanceDispatch === null ? (
        <>
          <DnDCell
            key={child.id}
            layout={layout}
            cellData={child}
            index={index}
          />
        </>
      ) : (
        <Cell cellData={child} key={child.id} layout={layout} />
      )
    );

    return (
      <Col span={span} className={"lane " + direction + (className || "")}>
        <div style={{ width: "100%", height: "100%" }} ref={ref}>
          {cells}
        </div>
      </Col>
    );
  }
);
