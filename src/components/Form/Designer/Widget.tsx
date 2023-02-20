import React from "react";
import { WidgetData } from "../schema";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { Button } from "antd";

interface WidgetProps {
  widget: WidgetData;
}

const StyledLi = styled.li`
  font-size: 12px;
  box-sizing: border-box;
  width: 140px;
  display: inline-block;
  cursor: move;
  border: 1px solid #f0f0f0;
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

export function Widget({ widget }: WidgetProps): JSX.Element {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: widget.type,
      createWidgetInstance: widget.createWidgetInstance,
    },
    collect: (monitor) => {
      return {
        isDragging: !!monitor.isDragging(),
      };
    },
  });

  return (
    <Button
      block={true}
      ref={drag}
      icon={widget.icon}
      key={widget.name}
      style={{ opacity: isDragging ? "0.5" : 1 }}
      type={"dashed"}
    >
      {widget.name}
    </Button>
  );
}
