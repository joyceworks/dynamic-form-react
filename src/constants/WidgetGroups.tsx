import { WidgetData } from "../components/Designer/schemas/WidgetData";
import {
  AiOutlineCalendar,
  AiOutlineCheckSquare,
  AiOutlineCopy,
  AiOutlineDownSquare,
  AiOutlineEdit,
  AiOutlineMinus,
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
        enable: true,
      },
      {
        type: "textarea",
        icon: <AiOutlineEdit />,
        name: "多行文本",
        enable: true,
      },
      {
        type: "select",
        icon: <AiOutlineDownSquare />,
        name: "下拉选择",
        enable: true,
      },
      {
        type: "datetime",
        icon: <AiOutlineCalendar />,
        name: "日期时间",
        enable: true,
      },
      {
        type: "tree",
        icon: <AiOutlineDownSquare />,
        name: "级联选择",
        enable: false,
      },
      {
        type: "checkbox",
        icon: <AiOutlineCheckSquare />,
        name: "多选",
        enable: true,
      },
    ],
  },
  {
    name: "高级字段",
    widgets: [
      { type: "grid", icon: <AiOutlineTable />, name: "布局", enable: true },
      {
        type: "list",
        icon: <AiOutlineOrderedList />,
        name: "列表",
        enable: true,
      },
      {
        type: "separator",
        icon: <AiOutlineMinus />,
        name: "分割线",
        enable: false,
      },
      { type: "tab", icon: <AiOutlineCopy />, name: "标签页", enable: false },
    ],
  },
];
