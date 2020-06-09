import React from "react";
import { WidgetData } from "../../schemas/WidgetData";
import { useDrag } from "react-dnd";
import styled from "styled-components";

interface WidgetProps {
  widget: WidgetData;
}

const StyledLi = styled.li`
  font-size: 14px;
  box-sizing: border-box;
  width: 125px;
  display: inline-block;
  cursor: move;
  border: 1px solid #a3a3a3;
  padding: 5px 10px;
  margin: 2px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: white;

  > * {
    margin-right: 4px;
    vertical-align: middle;
  }
`;

export function Widget({ widget }: WidgetProps) {
  const [{ isDragging }, drag] = useDrag({
    item: { type: widget.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <StyledLi
      key={widget.name}
      style={{ opacity: isDragging ? "0.5" : 1 }}
      ref={drag}
    >
      {widget.icon}
      <span>{widget.name}</span>
    </StyledLi>
  );
}
