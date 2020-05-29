import React, { Dispatch, useReducer } from "react";
import { Cell } from "../Designer/components/Cell";
import { reducer } from "../Designer/util";
import { CellData } from "../Designer/schemas/CellData";

interface FormProps {
  data: CellData;
}

interface DispatchProps {
  type: "UPDATE";
  data: CellData;
}

export const UserContext = React.createContext<Dispatch<DispatchProps>>(
  {} as Dispatch<DispatchProps>
);
export default function ({ data }: FormProps) {
  const [innerData, dispatch] = useReducer(reducer, data);
  return (
    <UserContext.Provider value={dispatch}>
      <Cell cellData={innerData} />
    </UserContext.Provider>
  );
}
