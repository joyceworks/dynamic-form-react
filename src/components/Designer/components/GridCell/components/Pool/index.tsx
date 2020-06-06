import React, { forwardRef, useContext } from "react";
import { Button, Row, Col } from "antd";
import styled from "styled-components";
import update from "immutability-helper";
import { CellData } from "../../../../schemas/CellData";
import { InstanceContext } from "../../../../../Instance";
import { DndLane } from "./components/DndLane";
import { Lane } from "./components/Lane";
import "./index.css";
import { LaneData } from "../../../../schemas/LaneData";

interface PoolProps {
  direction?: "column" | "row";
  cellData: CellData;
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
  ({ direction = "column", cellData }: PoolProps, ref: any) => {
    const instanceDispatch = useContext(InstanceContext);
    const isDesigner = instanceDispatch === null;
    function getLane(lane: LaneData, index: number) {
      return isDesigner ? (
        <DndLane
          key={cellData.id + "-" + index}
          direction={direction}
          cellDataList={lane.cellDataList}
          location={{
            parentId: cellData.id,
            index: index,
          }}
          span={lane.span}
        />
      ) : (
        <Lane
          key={cellData.id + "-" + index}
          cellDataList={lane.cellDataList}
          direction={direction}
          span={lane.span}
        />
      );
    }

    return (
      <>
        <Row ref={ref} className={"lanes"}>
          {direction === "column" ? (
            <>{cellData.lanes!.map((lane, index) => getLane(lane, index))}</>
          ) : (
            <>
              {!isDesigner && (
                <InstanceListHeaderItem span={12}>
                  {cellData.lanes![0].cellDataList.map((item) => (
                    <div>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </InstanceListHeaderItem>
              )}
              {cellData.lanes!.map((lane) => {
                return getLane(lane, 0);
              })}
            </>
          )}
        </Row>
        {!isDesigner && direction === "row" && (
          <Button
            onClick={() => {
              instanceDispatch({
                type: "UPDATE",
                data: update(cellData, {
                  lanes: {
                    $push: [
                      update(cellData.lanes![0], {
                        cellDataList: {
                          $apply: function (x: CellData[]) {
                            return x.map((y) => ({
                              ...y,
                              id: y.id + +new Date(),
                            }));
                          },
                        },
                      }),
                    ],
                  },
                }),
              });
            }}
            type={"link"}
          >
            Add
          </Button>
        )}
      </>
    );
  }
);
