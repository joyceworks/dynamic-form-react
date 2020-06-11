import React, { CSSProperties, forwardRef, useContext } from "react";
import { CellData } from "../schemas/CellData";
import { InputCell } from "./InputCell";
import { TextAreaCell } from "./TextAreaCell";
import { GridCell } from "./GridCell";
import { SelectCell } from "./SelectCell";
import { DateCell } from "./DateCell";
import { InstanceContext } from "../../Instance";
import CheckboxCell from "./CheckboxCell";
import { LabelCell } from "./LabelCell";

interface CellProps {
  cellData: CellData;
  layout?: "vertical" | "horizontal";
  style?: CSSProperties;
  onClick?: (event: any) => void;
  className?: string;
}
export const Cell = forwardRef(
  (
    { cellData, layout = "horizontal", style, onClick, className }: CellProps,
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
                data={data}
                dispatch={instanceDispatch}
                layout={layout}
              />
            </>
          ) : data.type === "textarea" ? (
            <>
              <TextAreaCell
                data={data}
                dispatch={instanceDispatch}
                layout={layout}
              />
            </>
          ) : data.type === "grid" ? (
            <>
              <GridCell data={data} />
            </>
          ) : data.type === "list" ? (
            <>
              <GridCell data={data} direction={"vertical"} />
            </>
          ) : data.type === "select" ? (
            <>
              <SelectCell
                data={data}
                dispatch={instanceDispatch}
                layout={layout}
              />
            </>
          ) : data.type === "datetime" ? (
            <DateCell data={data} dispatch={instanceDispatch} layout={layout} />
          ) : data.type === "checkbox" ? (
            <CheckboxCell
              data={data}
              dispatch={instanceDispatch}
              layout={layout}
            />
          ) : data.type === "label" ? (
            <LabelCell
              data={data}
              dispatch={instanceDispatch}
              layout={layout}
            />
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
);
