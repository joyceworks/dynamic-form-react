import React, { CSSProperties, forwardRef, useContext } from "react";
import { CellData } from "../../schemas/CellData";
import { FormContext } from "../GridCell/components/Pool";
import { InputCell } from "../InputCell";
import { TextAreaCell } from "../TextAreaCell";
import { GridCell } from "../GridCell";
import { SelectCell } from "../SelectCell";
import { DateCell } from "../DateCell";

interface CellProps {
  cellData: CellData;
  layout?: "inline" | "default";
  style?: CSSProperties;
  onClick?: (event: any) => void;
  className?: string;
}
export const Cell = forwardRef(
  (
    { cellData, layout = "default", style, onClick, className }: CellProps,
    ref: any
  ) => {
    const dispatch = useContext(FormContext);
    const data = {
      ...cellData,
      required: false,
      warnable: false,
      layout: "default",
      labeled: true,
    };
    return (
      <>
        <div
          ref={ref}
          style={style}
          className={
            "instance" + (cellData.active ? " active" : "") + (className || "")
          }
          onClick={onClick}
        >
          {cellData.type === "input" ? (
            <>
              <InputCell element={data} dispatch={dispatch} layout={layout} />
            </>
          ) : cellData.type === "textarea" ? (
            <>
              <TextAreaCell element={data} dispatch={dispatch} />
            </>
          ) : cellData.type === "grid" ? (
            <>
              <GridCell element={data} />
            </>
          ) : cellData.type === "list" ? (
            <>
              <GridCell element={data} direction={"row"} />
            </>
          ) : cellData.type === "select" ? (
            <>
              <SelectCell cellData={data} dispatch={dispatch} />
            </>
          ) : cellData.type === "datetime" ? (
            <DateCell data={data} dispatch={dispatch} />
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
);
