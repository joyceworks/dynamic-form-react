import React, {
  CSSProperties,
  forwardRef,
  useContext,
  useReducer,
} from "react";
import { setValue } from "./util";
import "./index.css";
import { DndLane } from "./components/DndLane";
import { Lane } from "./components/Lane";
import { CellData } from "../../../../schemas/CellData";
import { DesignerContext } from "../../../../index";

interface PoolProps {
  direction?: "column" | "row";
  cellData: CellData;
  style?: CSSProperties;
}

export const FormContext = React.createContext<any>(null);

export const Pool = forwardRef(
  ({ direction = "column", cellData, style }: PoolProps, ref: any) => {
    const [, dispatch] = useReducer(
      function (state: any, action: any) {
        switch (action.type) {
          case "SET_CURRENT":
            return { ...state, current: action.element };
          case "SET_VALUE":
            setValue(state.data, action.target, action.value);
            return { ...state };
          default:
            return state;
        }
      },
      { current: null, data: cellData }
    );
    const designerDispatch = useContext(DesignerContext);
    return (
      <FormContext.Provider value={dispatch}>
        <table ref={ref} className={"lanes"} style={style}>
          <tbody>
            {direction === "column" ? (
              <tr>
                {cellData.lanes?.map((lane, index) => {
                  return designerDispatch ? (
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
                    <Lane
                      key={cellData.id + "-" + index}
                      cellDataList={lane.cellDataList}
                      direction={direction}
                    />
                  );
                })}
              </tr>
            ) : (
              <>
                {cellData.lanes?.map((lane, index) => {
                  return (
                    <tr key={cellData.id + "-" + index}>
                      <DndLane
                        cellDataList={lane.cellDataList}
                        direction={direction}
                        location={{
                          parentId: cellData.id,
                          laneIndex: index,
                        }}
                      />
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </FormContext.Provider>
    );
  }
);
