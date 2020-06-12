import React, { forwardRef, useImperativeHandle, useReducer } from "react";
import { Cell, CustomCell } from "./Designer/components/Cell";
import { reducer } from "./Designer/util";
import { CellData } from "./Designer/schemas/CellData";
import { getData } from "./Designer/components/GridCell/components/Pool/util";

interface FormProps {
  data: CellData;
  customCells?: CustomCell[];
}

/**
 * Instance context provides the same utilities with designer context,
 * but also allows user's input
 */
export const InstanceContext = React.createContext<any>(null);
export default forwardRef(({ data, customCells }: FormProps, ref: any) => {
  const [innerData, dispatch] = useReducer(reducer, data);
  useImperativeHandle(ref, () => ({
    getData: function () {
      return getData(innerData);
    },
    validate: function () {
      dispatch({
        type: "VALIDATE",
      });
    },
  }));
  return (
    <InstanceContext.Provider value={dispatch}>
      <Cell
        ref={ref}
        cellData={innerData}
        className={"preview"}
        customCells={customCells}
      />
    </InstanceContext.Provider>
  );
});
