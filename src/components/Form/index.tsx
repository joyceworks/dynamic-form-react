import React, { forwardRef, useImperativeHandle, useReducer } from "react";
import { Cell, CustomCell } from "./Designer/Cell";
import { forEach, reducer } from "./Designer/util";
import { CellData, ConstrainViolation } from "./schema";
import {
  getValues,
  InteractContext,
  validateFormat,
  validateRequired,
} from "./util";
import { useUpdateEffect } from "react-use";
import useInteractions from "./hooks/interactions";
import { InputCellData } from "./InputCell/schema";

export interface InstanceProps {
  data: CellData;
  customCells?: CustomCell[];
}

/**
 * Instance context provides the same utilities with designer context,
 * but also allows user's input
 */
export const InstanceContext = React.createContext<any>(null);
const Form = forwardRef(({ data, customCells }: InstanceProps, ref: any) => {
  const [innerData, dispatch] = useReducer(reducer, data);
  useImperativeHandle(ref, () => ({
    getData: function () {
      return getValues(innerData);
    },
    validate: function (): ConstrainViolation[] {
      dispatch({
        type: "VALIDATE",
      });
      const constraintViolations: ConstrainViolation[] = [];
      forEach(innerData, function (cellData) {
        if (!validateRequired(cellData)) {
          constraintViolations.push({
            id: cellData.id,
            message: `${cellData.label} 不能为空`,
            value: cellData.value,
            description: "required",
          });
        }

        if (!validateFormat(cellData as InputCellData)) {
          constraintViolations.push({
            id: cellData.id,
            message: `${cellData.label} 格式有误`,
            value: cellData.value,
            description: "format",
          });
        }
      });
      return constraintViolations;
    },
  }));
  const interactions = useInteractions(dispatch, innerData);
  useUpdateEffect(() => {
    dispatch({ type: "INIT", data });
  }, [data]);
  return (
    <InstanceContext.Provider value={dispatch}>
      <InteractContext.Provider value={interactions}>
        <Cell
          ref={ref}
          cellData={innerData}
          className={"preview"}
          customCells={customCells}
        />
      </InteractContext.Provider>
    </InstanceContext.Provider>
  );
});

export default Form;
