import OptionConfig from "./SelectCell/SelectCellConfig/OptionConfig";
import { Button, Form } from "antd";
import React, { useContext } from "react";
import { useVerticalDragDropMemberEvent } from "../hook";
import { DesignerContext } from "./Designer";
import { SelectCellData } from "./SelectCell/schema";

const CellOptionsConfig = ({ data }: { data: SelectCellData }): JSX.Element => {
  const { onChange, onRemove, move } = useVerticalDragDropMemberEvent(data);
  const designerDispatch = useContext(DesignerContext);
  return (
    <Form.Item label={"选项"}>
      <>
        {data &&
          data.options &&
          data.options.map((option, index) => (
            <OptionConfig
              key={"option-config-" + index}
              index={index}
              label={option.label}
              onChange={onChange}
              onRemove={onRemove}
              move={move}
            />
          ))}
        <Button
          type={"link"}
          onClick={() => {
            const copy = { ...data };
            copy.options!.push({ label: "新选项", value: +new Date() });
            designerDispatch({
              type: "UPDATE",
              data: copy,
            });
          }}
        >
          Add
        </Button>
      </>
    </Form.Item>
  );
};
export default CellOptionsConfig;
