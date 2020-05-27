import React, { useReducer } from "react";
import { Cell } from "../Cell";
import { reducer, peek } from "../../util";
import { CellData } from "../../schemas/CellData";

interface PreviewProps {
  data: CellData;
}

export const PreviewContext = React.createContext<any>(null);
export default function ({ data }: PreviewProps) {
  const [innerData, dispatch] = useReducer(
    reducer,
    peek(data, function (item) {
      item.id += "p";
    })
  );
  return (
    <PreviewContext.Provider value={dispatch}>
      <Cell cellData={innerData} />
    </PreviewContext.Provider>
  );
}
