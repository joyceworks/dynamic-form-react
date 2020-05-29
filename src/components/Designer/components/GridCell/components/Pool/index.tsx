import React, {
  CSSProperties,
  forwardRef,
  useContext,
  useReducer,
} from "react";
import { formReducer } from "./util";
import "./index.css";
import { DndLane } from "./components/DndLane";
import { Lane } from "./components/Lane";
import { CellData } from "../../../../schemas/CellData";
import { Button } from "antd";
import update from "immutability-helper";
import { UserContext } from "../../../../../Form";

interface PoolProps {
  direction?: "column" | "row";
  cellData: CellData;
  style?: CSSProperties;
}

export const FormContext = React.createContext<any>(null);

export const Pool = forwardRef(
  ({ direction = "column", cellData, style }: PoolProps, ref: any) => {
    const userDispatch = useContext(UserContext);
    const isDesigner = userDispatch === null;
    function getLane(lane: any, index: number) {
      return isDesigner ? (
        <DndLane
          key={cellData.id + "-" + index}
          direction={direction}
          cellDataList={lane.cellDataList}
          location={{
            parentId: cellData.id,
            laneIndex: index,
          }}
        />
      ) : (
        <>
          <Lane
            key={cellData.id + "-" + index}
            cellDataList={lane.cellDataList}
            direction={direction}
          />
        </>
      );
    }
    const [, dispatch] = useReducer(formReducer, {
      data: cellData,
    });
    return (
      <FormContext.Provider value={dispatch}>
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
                    <td
                      style={{
                        padding: 10,
                        whiteSpace: "nowrap",
                        border: "1px solid #d3d3d3",
                        width: "100%",
                        overflowX: "auto",
                      }}
                    >
                      {cellData.lanes![0].cellDataList.map((item) => (
                        <div style={{ width: 200, display: "inline-block" }}>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </td>
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
              userDispatch({
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
      </FormContext.Provider>
    );
  }
);
