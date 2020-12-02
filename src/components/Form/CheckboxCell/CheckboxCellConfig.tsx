import React, { useContext } from "react";
import { CellData } from "../schema";
import { DesignerContext } from "../Designer";
import { Input, Switch, Form, Button } from "antd";
import update from "immutability-helper";
import OptionConfig from "../../SelectCell/SelectCellConfig/OptionConfig";

interface CheckboxCellConfigProps {
  data: CellData;
}

export default function CheckboxCellConfig({ data }: CheckboxCellConfigProps) {
  const designerDispatch = useContext(DesignerContext);
  return (
    <>
      <Form labelCol={{ span: 8 }}>
        <Form.Item label={"Title"}>
          <Input
            value={data.label}
            onChange={(event) => {
              designerDispatch({
                type: "UPDATE",
                data: update(data, {
                  label: { $set: event.target.value },
                }),
              });
            }}
          />
        </Form.Item>
        <Form.Item label={"Required"}>
          <Switch
            checked={!!data.required}
            onChange={(checked) => {
              designerDispatch({
                type: "UPDATE",
                data: update(data, {
                  required: { $set: checked },
                }),
              });
            }}
          />
        </Form.Item>
        <Form.Item label={"Readonly"}>
          <Switch
            checked={data.disabled}
            onChange={(checked) => {
              designerDispatch({
                type: "UPDATE",
                data: update(data, {
                  disabled: { $set: checked },
                }),
              });
            }}
          />
        </Form.Item>
        <Form.Item label={"选项"}>
          <>
            {data &&
              data.options &&
              data.options.map((option, index) => (
                <OptionConfig
                  key={"option-config-" + index}
                  index={index}
                  data={option.label}
                  onChange={(label) => {
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
                  }}
                  onRemove={() => {
                    designerDispatch({
                      type: "UPDATE",
                      data: {
                        ...data,
                        options: update(data.options, {
                          $splice: [[index, 1]],
                        }),
                      },
                    });
                  }}
                  move={(from, to) => {
                    const dragItem = data.options?.[from]!;
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
                  }}
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
              添加列
            </Button>
          </>
        </Form.Item>
      </Form>
    </>
  );
}
