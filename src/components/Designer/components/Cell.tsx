import React, {
  CSSProperties,
  forwardRef,
  FunctionComponent,
  useContext,
} from "react";
import { CellData } from "../schemas/CellData";
import { InputCell } from "./InputCell";
import { TextAreaCell } from "./TextAreaCell";
import { GridCell } from "./GridCell";
import { SelectCell } from "./SelectCell";
import { DateCell } from "./DateCell";
import { InstanceContext } from "../../Instance";
import CheckboxCell from "./CheckboxCell";
import { LabelCell } from "./LabelCell";

export interface PhysicalCellProps {
  data: CellData;
  layout?: "vertical" | "horizontal";
  dispatch: any;
}
export interface CustomCell {
  type: string;
  cell: FunctionComponent<PhysicalCellProps>;
  icon: JSX.Element;
  enable: boolean;
  name: string;
}
interface CellProps {
  cellData: CellData;
  layout?: "vertical" | "horizontal";
  style?: CSSProperties;
  onClick?: (event: any) => void;
  className?: string;
  customCells?: CustomCell[];
}
export const Cell = forwardRef(
  (
    {
      cellData,
      layout = "horizontal",
      style,
      onClick,
      className,
      customCells,
    }: CellProps,
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
            (customCells &&
              customCells.some((item) => item.type === data.type) &&
              React.createElement(
                customCells.filter((item) => item.type === data.type)[0].cell,
                {
                  data,
                  dispatch: instanceDispatch,
                  layout,
                }
              )) || <></>
          )}
        </div>
      </>
    );
  }
);
