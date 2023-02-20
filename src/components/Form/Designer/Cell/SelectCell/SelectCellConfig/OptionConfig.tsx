import React from "react";
import { Button, Input } from "antd";
import { useVerticalDragDropMemberRef } from "../../../../../hook";
import MenuOutlined from "@ant-design/icons/MenuOutlined";
import MinusCircleOutlined from "@ant-design/icons/MinusCircleOutlined";

interface OptionConfigProps {
  index: number;
  label: string;
  move: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  onChange: (index: number, data: string) => void;
}

export default function OptionConfig({
  index,
  label,
  move,
  onRemove,
  onChange,
}: OptionConfigProps): JSX.Element {
  const ref = useVerticalDragDropMemberRef(index, move);
  return (
    <>
      <div ref={ref}>
        <MenuOutlined className="cursor-move" />
        <Input
          onChange={(event) => {
            onChange(index, event.target.value);
          }}
          value={label}
          size={"small"}
          className="w-32 mr-1 ml-1"
        />
        <Button
          type={"link"}
          onClick={() => {
            onRemove(index);
          }}
          className="p-0"
        >
          <MinusCircleOutlined />
        </Button>
      </div>
    </>
  );
}
