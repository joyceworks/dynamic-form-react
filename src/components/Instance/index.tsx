import React, { forwardRef, useImperativeHandle, useReducer } from "react";
import { Cell } from "../Designer/components/Cell";
import { reducer } from "../Designer/util";
import { CellData } from "../Designer/schemas/CellData";
import { getData } from "../Designer/components/GridCell/components/Pool/util";

interface FormProps {
  data: CellData;
}

export const UserContext = React.createContext<any>(null);
export default forwardRef(({ data }: FormProps, ref: any) => {
  const [innerData, dispatch] = useReducer(reducer, data);
  useImperativeHandle(ref, () => ({
    getData: function () {
      return getData(data);
    },
  }));
  return (
    <UserContext.Provider value={dispatch}>
      <Cell cellData={innerData} className={"preview"} />
    </UserContext.Provider>
  );
});
