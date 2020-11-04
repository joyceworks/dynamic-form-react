import React, { forwardRef, useContext, useMemo } from "react";
import { CellData, SwimlaneLocation } from "../../../schema";
import { DnDCell } from "../../DnDCell";
import { Cell, CustomCell } from "../../Cell";
import { InstanceContext } from "../../../index";
import { Col } from "antd";

interface LaneProps {
  cellDataList: CellData[];
  direction: "horizontal" | "vertical";
  className?: string;
  span?: number;
  customCells?: CustomCell[];
  location: SwimlaneLocation;
}

export const Lane = forwardRef(
  (
    {
      cellDataList,
      direction,
      className,
      span = 24,
      customCells,
      location,
    }: LaneProps,
    ref: any
  ) => {
    const instanceDispatch = useContext(InstanceContext);
    const cells = useMemo(() => {
      return cellDataList.map((child, index) => {
        const props = {
          location,
          key: child.id,
          layout: direction,
          cellData: child,
          customCells,
          style: {
            width: child.width,
          },
        };
        return instanceDispatch === null ? (
          <DnDCell {...props} index={index} />
        ) : (
          <Cell {...props} />
        );
      });
    }, [cellDataList, customCells, direction, instanceDispatch, location]);

    return (
      <Col span={span} className={`lane ${direction}${className || ""}`}>
        <div style={{ width: "100%", minHeight: 42, height: "100%" }} ref={ref}>
          {cells}
        </div>
      </Col>
    );
  }
);
