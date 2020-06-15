import { WidgetData } from "../components/Designer/schemas/WidgetData";
import {
  AiOutlineCalendar,
  AiOutlineCheckSquare,
  AiOutlineDownSquare,
  AiOutlineEdit,
  AiOutlineFontSize,
  AiOutlineOrderedList,
  AiOutlineTable,
} from "react-icons/ai";
import React from "react";

export const WidgetGroups: { name: string; widgets: WidgetData[] }[] = [
  {
    name: "基础字段",
    widgets: [
      {
        type: "input",
        icon: <AiOutlineEdit />,
        name: "单行文本",
      },
      {
        type: "select",
        icon: <AiOutlineDownSquare />,
        name: "下拉选择",
      },
      {
        type: "datetime",
        icon: <AiOutlineCalendar />,
        name: "日期时间",
      },
      {
        type: "checkbox",
        icon: <AiOutlineCheckSquare />,
        name: "多选",
      },
      {
        type: "label",
        icon: <AiOutlineFontSize />,
        name: "文本",
      },
    ],
  },
  {
    name: "高级字段",
    widgets: [
      { type: "grid", icon: <AiOutlineTable />, name: "布局" },
      {
        type: "list",
        icon: <AiOutlineOrderedList />,
        name: "列表",
      },
    ],
  },
];
