import React, { useContext, useRef } from "react";
import { useDrag, useDrop, XYCoord } from "react-dnd";
import update from "immutability-helper";
import { DesignerContext } from "../Form/Designer";
import { CellData } from "../Form/schema";

interface DragItem {
  index: number;
  type: string;
}

export function useVerticalDragDropMemberRef(
  index: number,
  move: (from: number, to: number) => void
): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag({
    item: {
      type: "config",
      index: index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "config",
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      move(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  drag(drop(ref));
  return ref;
}

export function useVerticalDragDropMemberEvent(
  data: CellData
): {
  onChange: (index: number, label: string) => void;
  onRemove: (index: number) => void;
  move: (from: number, to: number) => void;
} {
  const designerDispatch = useContext(DesignerContext);
  return {
    onChange(index: number, label: string) {
      designerDispatch({
        type: "UPDATE",
        data: {
          ...data,
          options: update(data.options, {
            [index]: {
              label: { $set: label || "" },
            },
          }),
        },
      });
    },
    onRemove(index: number) {
      designerDispatch({
        type: "UPDATE",
        data: {
          ...data,
          options: update(data.options, {
            $splice: [[index, 1]],
          }),
        },
      });
    },
    move(from: number, to: number) {
      const dragItem = data.options![from]!;
      designerDispatch({
        type: "UPDATE",
        data: {
          ...data,
          options: update(data.options, {
            $splice: [
              [from, 1],
              [to, 0, dragItem],
            ],
          }),
        },
      });
    },
  };
}
