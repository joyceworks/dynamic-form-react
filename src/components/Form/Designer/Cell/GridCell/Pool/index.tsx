import React, { forwardRef, useCallback, useContext, useMemo } from "react";
import { Button, Col, Row } from "antd";
import styled from "styled-components";
import update from "immutability-helper";
import { CellData, LaneData, LanedCellData } from "../../../../schema";
import { DndLane } from "./DndLane";
import { Lane } from "./Lane";
import "./index.css";
import { CustomCell } from "../../index";
import { FormGroup } from "../../../FormGroup";
import { InstanceContext } from "../../../../index";

interface PoolProps {
  direction?: "horizontal" | "vertical";
  cellData: LanedCellData;
  customCells?: CustomCell[];
}

const InstanceListHeaderItem = styled(Col)`
  padding: 0 10px;
  white-space: nowrap;
  width: 100%;

  > div {
    width: 200px;
    display: inline-block;
  }
`;

export const Pool = forwardRef(
  (
    { direction = "horizontal", cellData, customCells }: PoolProps,
    ref: any
  ) => {
    const instanceDispatch = useContext(InstanceContext);
    const isDesigner = instanceDispatch === null;
    const getLane = useCallback(
      (lane: LaneData, index: number) => {
        const props = {
          key: `${cellData.id}-${index}`,
          direction: direction,
          cellDataList: lane.cellDataList,
          location: {
            parentId: cellData.id,
            index: index,
          },
          span: lane.span,
          customCells: customCells,
          disabled: cellData.disabled,
        };
        return isDesigner ? <DndLane {...props} /> : <Lane {...props} />;
      },
      [cellData.disabled, cellData.id, customCells, direction, isDesigner]
    );
    const lanes = useMemo(
      () => cellData.lanes.map((lane, index) => getLane(lane, index)),
      [cellData.lanes, getLane]
    );

    const addRow = useCallback(
      () =>
        instanceDispatch({
          type: "UPDATE",
          data: update(cellData, {
            lanes: {
              $push: [
                update(cellData.lanes[0], {
                  cellDataList: {
                    $apply: (x: CellData[]) =>
                      x.map((y) => ({
                        ...y,
                        value: null,
                      })),
                  },
                  hiddenValues: {
                    $apply: () => ({}),
                  },
                }),
              ],
            },
          }),
        }),
      [cellData, instanceDispatch]
    );

    return (
      <>
        <Row ref={ref} className={"lanes"}>
          {direction === "horizontal" ? (
            // Grid, Tab
            <>{lanes}</>
          ) : (
            // List
            <FormGroup
              required={!!cellData.required}
              warning={cellData.warning}
              warnable={cellData.warnable}
              element={
                <div
                  className={`overflow-auto ${
                    isDesigner
                      ? "border-[#f0f0f0] border-dashed border [&>.lane]:border-none"
                      : "[&>.lane]:p-0"
                  }`}
                >
                  {!isDesigner && ( // Header row
                    <InstanceListHeaderItem span={24}>
                      {cellData.lanes[0].cellDataList.map((item) => (
                        <div style={{ width: item.width }} key={item.id}>
                          {item.required && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </InstanceListHeaderItem>
                  )}
                  {lanes}
                  {!isDesigner &&
                    direction === "vertical" &&
                    !cellData.disabled && (
                      <Button size={"small"} onClick={addRow} type={"link"}>
                        添加行
                      </Button>
                    )}
                </div>
              }
              label={<span>{cellData.label}</span>}
            />
          )}
        </Row>
      </>
    );
  }
);
