import React, { forwardRef, useCallback, useContext, useMemo } from "react";
import { Button, Col, Row } from "antd";
import styled from "styled-components";
import update from "immutability-helper";
import { CellData, LaneData, LanedCellData } from "../../../../schema";
import { InstanceContext } from "../../../../index";
import { DndLane } from "./DndLane";
import { Lane } from "./Lane";
import "./index.css";
import { CustomCell } from "../../index";
import { FormGroup } from "../../../FormGroup";

interface PoolProps {
  direction?: "horizontal" | "vertical";
  cellData: LanedCellData;
  customCells?: CustomCell[];
}

const InstanceListHeaderItem = styled(Col)`
  padding: 0 10px;
  white-space: nowrap;
  width: 100%;
  overflow-x: auto;

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
        };
        return isDesigner ? <DndLane {...props} /> : <Lane {...props} />;
      },
      [cellData.id, customCells, direction, isDesigner]
    );
    const lanes = useMemo(
      () => cellData.lanes.map((lane, index) => getLane(lane, index)),
      [cellData.lanes, getLane]
    );

    return (
      <>
        <Row ref={ref} className={"lanes"}>
          {direction === "horizontal" ? (
            <>{lanes}</>
          ) : (
            <FormGroup
              required={!!cellData.required}
              warning={cellData.warning}
              warnable={cellData.warnable}
              element={
                <>
                  {!isDesigner && (
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
                  {!isDesigner && direction === "vertical" && (
                    <Button
                      size={"small"}
                      onClick={() =>
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
                        })
                      }
                      type={"link"}
                    >
                      添加行
                    </Button>
                  )}
                </>
              }
              label={<span>{cellData.label}</span>}
            />
          )}
        </Row>
      </>
    );
  }
);
