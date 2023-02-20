import React, { forwardRef, useContext, useMemo, useState } from "react";
import {
  CellData,
  ReducerActionProps,
  SwimlaneLocation,
} from "../../../../schema";
import { DnDCell } from "../../../DnDCell";
import { Cell, CustomCell } from "../../index";
import { Button, Col } from "antd";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { useTimeoutFn } from "react-use";
import { InstanceContext } from "../../../../index";

interface LaneProps {
  cellDataList: CellData[];
  direction: "horizontal" | "vertical";
  className?: string;
  span?: number;
  customCells?: CustomCell[];
  location: SwimlaneLocation;
  disabled?: boolean;
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
      disabled,
    }: LaneProps,
    ref: any
  ) => {
    const instanceDispatch =
      useContext<React.Dispatch<ReducerActionProps>>(InstanceContext);
    const isDesigner = instanceDispatch === null;
    const [mouseOver, setMouseOver] = useState<boolean>(false);
    const [, cancel, reset] = useTimeoutFn(() => {
      setMouseOver(false);
    }, 1000);
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
      <Col
        span={span}
        onMouseOver={() => {
          cancel();
          setMouseOver(true);
        }}
        onMouseOut={reset}
        className={`lane ${direction}${className || ""}`}
      >
        <div className="w-full h-full relative min-h-px-42" ref={ref}>
          {cells}
          {direction === "vertical" && !disabled && !isDesigner && (
            <Button
              onClick={() =>
                instanceDispatch({
                  type: "DELETE_LANE",
                  ...location,
                })
              }
              className="cursor-pointer mt-2"
              type={"link"}
              size={"small"}
              icon={<DeleteOutlined />}
            />
          )}
        </div>
      </Col>
    );
  }
);
