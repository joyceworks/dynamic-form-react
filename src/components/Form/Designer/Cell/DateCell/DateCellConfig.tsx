import React, { useState } from "react";
import { CellData } from "../../../schema";
import { AutoComplete, Form, Typography } from "antd";
import CellLabelConfig from "../../../Config/CellLabelConfig";
import CellRequiredConfig from "../../../Config/CellRequiredConfig";
import CellReadonlyConfig from "../../../Config/CellReadonlyConfig";
import { labelCol } from "../../../constant";

const { Text } = Typography;

interface DateCellConfigProps {
  data: CellData;
}

export default function DateCellConfig({
  data,
}: DateCellConfigProps): JSX.Element {
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
  return (
    <>
      <Form labelCol={labelCol}>
        <CellLabelConfig data={data} />
        <CellRequiredConfig data={data} />
        <CellReadonlyConfig data={data} />
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
