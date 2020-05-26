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
import { FormGroup } from "../../../FormGroup";

interface PoolProps {
  direction?: "column" | "row";
  cellData: CellData;
  style?: CSSProperties;
}

export const FormContext = React.createContext<any>(null);

export const Pool = forwardRef(
  ({ direction = "column", cellData, style }: PoolProps, ref: any) => {
    function getLane(lane: any, index: number) {
      const isDesigner = preview === null;
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
    const preview = useContext(PreviewContext);
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
                {preview && (
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
        {preview && direction === "row" && (
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
