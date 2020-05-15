import React, { CSSProperties, forwardRef, useReducer } from "react";
import { setValue } from "./util";
import "./index.css";
import { Swimlane } from "./components/Swimlane";
import { CellData } from "../../schemas/CellData";

interface FormProps {
  direction?: "column" | "row";
  cellData: CellData;
  style?: CSSProperties;
}

export const FormContext = React.createContext<any>(null);

export const Grid = forwardRef(
  ({ direction = "column", cellData, style }: FormProps, ref: any) => {
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
    return (
      <FormContext.Provider value={dispatch}>
        <table ref={ref} className={"swimlanes"} style={style}>
          <tbody>
            {direction === "column" ? (
              <tr>
                {cellData.swimlanes?.map((swimlane, index) => {
                  return (
                    <Swimlane
                      key={cellData.id + "-" + index}
                      direction={direction}
                      cellDataList={swimlane.cellDataList}
                      location={{
                        parentId: cellData.id,
                        swimlaneIndex: index,
                      }}
                    />
                  );
                })}
              </tr>
            ) : (
              <>
                {cellData.swimlanes?.map((swimlane, index) => {
                  return (
                    <tr key={cellData.id + "-" + index}>
                      <Swimlane
                        cellDataList={swimlane.cellDataList}
                        direction={direction}
                        location={{
                          parentId: cellData.id,
                          swimlaneIndex: index,
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
