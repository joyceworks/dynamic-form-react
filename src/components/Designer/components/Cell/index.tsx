import React, { useContext, useRef, useState } from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import { CellData } from "../../schemas/CellData";
import { DesignerContext } from "../../index";
import { FormContext } from "../Grid";
import { InputCell } from "./components/InputCell";
import { GridCell } from "./components/GridCell";
import { SelectCell } from "./components/SelectCell";

interface CellProps {
  cellData: CellData;
  layout?: "inline" | "default";
  index: number;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Cell = function ({ cellData, index, layout }: CellProps) {
  const data = {
    ...cellData,
    required: false,
    warnable: false,
    layout: "default",
    labeled: true,
  };
  const ref = useRef<any>(null);
  const designerDispatch = useContext(DesignerContext);
  const [dropClassName, setDropClassName] = useState<string>("");
  const [{ isOver }, drop] = useDrop({
    accept: ["instance"],
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        setDropClassName("");
      }
      if (!monitor.isOver({ shallow: true })) {
        setDropClassName("");
      }
      if (monitor.getItem().id === cellData.id) {
        setDropClassName("");
      }
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        setDropClassName("");
      }
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      setDropClassName(
        hoverClientY > hoverMiddleY
          ? " drop-over-downward"
          : " drop-over-upward"
      );
    },
    collect: (monitor) => {
      console.log(cellData.id);
      return {
        isOver: monitor.isOver({ shallow: true }),
      };
    },
    drop(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      if (!monitor.isOver({ shallow: true })) {
        return;
      }

      let hoverIndex = index;
      const hoverBoundingRect = ref.current!.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) {
        return;
      }
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (hoverClientY > hoverMiddleY) {
        hoverIndex += 1;
      }
      designerDispatch({
        type: "MOVE",
        hoverIndex: hoverIndex,
        id: item.id,
      });
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: "instance", id: cellData.id, index },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
    begin: (monitor) => {
      console.log(monitor);
      designerDispatch({
        type: "ACTIVE",
        id: cellData.id,
      });
    },
  });
  drag(drop(ref));

  const dispatch = useContext(FormContext);
  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? "0.5" : 1 }}
      className={
        "instance" +
        (cellData.active ? " active" : "") +
        (isOver ? dropClassName : "")
      }
      onClick={(event) => {
        event.stopPropagation();
        designerDispatch({
          type: "ACTIVE",
          id: cellData.id,
        });
        designerDispatch({
          type: "EDIT",
          id: cellData.id,
        });
      }}
    >
      {cellData.type === "input" ? (
        <>
          <InputCell element={data} dispatch={dispatch} layout={layout} />
        </>
      ) : cellData.type === "grid" ? (
        <>
          <GridCell element={data} />
        </>
      ) : cellData.type === "select" ? (
        <>
          <SelectCell cellData={data} dispatch={dispatch} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};