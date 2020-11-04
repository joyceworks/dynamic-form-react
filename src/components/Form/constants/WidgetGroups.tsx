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
import { WidgetData } from "../schema";

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
        type: "textarea",
        icon: <AiOutlineEdit />,
        name: "多行文本",
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
      { type: "tab", icon: <AiOutlineTable />, name: "选项卡" },
      {
        type: "list",
        icon: <AiOutlineOrderedList />,
        name: "列表",
      },
    ],
  },
];
