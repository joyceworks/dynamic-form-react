import React, { CSSProperties, forwardRef, useReducer } from "react";
import { setValue } from "./util";
import "./index.css";
import { Swimlane } from "./components/Swimlane";
import { CellData } from "../../schemas/CellData";

interface DynamicFormProps {
  direction?: "column" | "row";
  cellData: CellData;
  style?: CSSProperties;
}

export const DynamicFormContext = React.createContext<any>(null);

export const DynamicForm = forwardRef(
  ({ direction = "column", cellData, style }: DynamicFormProps, ref: any) => {
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
      <DynamicFormContext.Provider value={dispatch}>
        <table ref={ref} className={"swimlanes"} style={style}>
          <tbody>
            {direction === "column" ? (
              <tr>
                {cellData.swimlanes?.map((swimlane, index) => {
                  return (
                    <Swimlane
                      key={cellData.id + "-" + index}
                      direction={direction}
                      elements={swimlane.cellDataList}
                      location={{ cellId: cellData.id, swimlaneIndex: index }}
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
                        elements={swimlane.cellDataList}
                        direction={direction}
                        location={{ cellId: cellData.id, swimlaneIndex: index }}
                      />
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </DynamicFormContext.Provider>
    );
  }
);
