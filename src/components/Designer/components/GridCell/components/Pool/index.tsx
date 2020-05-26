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
import { DesignerContext, PreviewContext } from "../../../../index";
import { Button } from "antd";
import update from "immutability-helper";

interface PoolProps {
  direction?: "column" | "row";
  cellData: CellData;
  style?: CSSProperties;
}

export const FormContext = React.createContext<any>(null);

export const Pool = forwardRef(
  ({ direction = "column", cellData, style }: PoolProps, ref: any) => {
    function getLane(lane: any, index: number) {
      const isDesigner = previewDispatch === null;
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
    const designerDispatch = useContext(DesignerContext);
    const previewDispatch = useContext(PreviewContext);
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
        {previewDispatch && direction === "row" && (
          <Button
            onClick={() => {
              designerDispatch({
                type: "UPDATE",
                data: update(cellData, {
                  lanes: {
                    $push: [
                      {
                        span: 100,
                        cellDataList: [],
                      },
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
