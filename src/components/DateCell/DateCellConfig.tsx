import React, { useContext, useState } from "react";
import { CellData } from "../Form/schema";
import { DesignerContext } from "../Form/Designer";
import { Input, Switch, Form, AutoComplete, Typography } from "antd";
import update from "immutability-helper";

const { Text } = Typography;

interface DateCellConfigProps {
  data: CellData;
}

export default function DateCellConfig({ data }: DateCellConfigProps) {
  const defaultValueOptions = [
    {
      label: (
        <>
          <Text>now: </Text>
          <Text type={"secondary"}>当前时间</Text>
        </>
      ),
      text: "now",
      value: "now",
    },
  ];
  const [currentDefaultValueOptions, setCurrentDefaultValueOptions] = useState(
    defaultValueOptions
  );
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
        <Form.Item label={"Default"}>
          <AutoComplete
            onSearch={(searchText) => {
              setCurrentDefaultValueOptions(
                defaultValueOptions.filter(
                  (item) => item.text.search(new RegExp(searchText, "i")) > -1
                )
              );
            }}
          >
            {currentDefaultValueOptions.map((option) => (
              <AutoComplete.Option value={option.value} key={option.value}>
                {option.label}
              </AutoComplete.Option>
            ))}
          </AutoComplete>
        </Form.Item>
      </Form>
    </>
  );
}
