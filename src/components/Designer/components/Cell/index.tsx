import React, { CSSProperties, forwardRef, useContext } from "react";
import { CellData } from "../../schemas/CellData";
import { InputCell } from "../InputCell";
import { TextAreaCell } from "../TextAreaCell";
import { GridCell } from "../GridCell";
import { SelectCell } from "../SelectCell";
import { DateCell } from "../DateCell";
import { InstanceContext } from "../../../Instance";

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
    const instanceDispatch = useContext(InstanceContext);
    const data = {
      required: false,
      warnable: false,
      layout: "default",
      labeled: true,
      ...cellData,
    };
    return (
      <>
        <div
          ref={ref}
          style={style}
          className={`instance ${
            !instanceDispatch && data.active ? " active " : " "
          }${className || ""}`}
          onClick={onClick}
        >
          {data.type === "input" ? (
            <>
              <InputCell
                element={data}
                dispatch={instanceDispatch}
                layout={layout}
              />
            </>
          ) : data.type === "textarea" ? (
            <>
              <TextAreaCell
                element={data}
                dispatch={instanceDispatch}
                layout={layout}
              />
            </>
          ) : data.type === "grid" ? (
            <>
              <GridCell element={data} />
            </>
          ) : data.type === "list" ? (
            <>
              <GridCell element={data} direction={"row"} />
            </>
          ) : data.type === "select" ? (
            <>
              <SelectCell
                cellData={data}
                dispatch={instanceDispatch}
                layout={layout}
              />
            </>
          ) : data.type === "datetime" ? (
            <DateCell data={data} dispatch={instanceDispatch} layout={layout} />
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
);
