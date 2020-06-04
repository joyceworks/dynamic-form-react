import React, { CSSProperties, forwardRef, useContext } from "react";
import styled from "styled-components";
import "./index.css";
import { DndLane } from "./components/DndLane";
import { Lane } from "./components/Lane";
import { CellData } from "../../../../schemas/CellData";
import { Button } from "antd";
import update from "immutability-helper";
import { InstanceContext } from "../../../../../Instance";

interface PoolProps {
  direction?: "column" | "row";
  cellData: CellData;
  style?: CSSProperties;
}

const InstanceListHeaderItem = styled.td`
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
  ({ direction = "column", cellData, style }: PoolProps, ref: any) => {
    const instanceDispatch = useContext(InstanceContext);
    const isDesigner = instanceDispatch === null;
    function getLane(lane: any, index: number) {
      return isDesigner ? (
        <DndLane
          key={cellData.id + "-" + index}
          direction={direction}
          cellDataList={lane.cellDataList}
          location={{
            parentId: cellData.id,
            index: index,
          }}
        />
      ) : (
        <Lane
          key={cellData.id + "-" + index}
          cellDataList={lane.cellDataList}
          direction={direction}
        />
      );
    }

    return (
      <>
        <table ref={ref} className={"lanes"} style={style}>
          <tbody>
            {direction === "column" ? (
              <tr>
                {cellData.lanes!.map((lane, index) => getLane(lane, index))}
              </tr>
            ) : (
              <>
                {!isDesigner && (
                  <tr>
                    <InstanceListHeaderItem>
                      {cellData.lanes![0].cellDataList.map((item) => (
                        <div>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </InstanceListHeaderItem>
                  </tr>
                )}
                {cellData.lanes!.map((lane, index) => {
                  return (
                    <tr key={cellData.id + "-" + index + "-parent"}>
                      {getLane(lane, 0)}
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
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
