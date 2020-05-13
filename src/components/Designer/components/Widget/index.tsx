import React from "react";
import { WidgetData } from "../../schemas/WidgetData";
import { useDrag } from "react-dnd";

interface WidgetProps {
  widget: WidgetData;
}

export function Widget({ widget }: WidgetProps) {
  const [{ isDragging }, drag] = useDrag({
    item: { type: widget.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <li
      key={widget.name}
      className={"widget"}
      style={{ opacity: isDragging ? "0.5" : 1 }}
      ref={drag}
    >
      {widget.icon}
      <span>{widget.name}</span>
    </li>
  );
}
