import { WidgetData } from "./schema";

export const WidgetGroups: { name: string; widgets: WidgetData[] }[] = [
  {
    name: "Basic",
    widgets: [
      {
        type: "input",
        name: "Input",
      },
      {
        type: "textarea",
        name: "Textarea",
      },
      {
        type: "select",
        name: "Select",
      },
      {
        type: "datetime",
        name: "Datepicker",
      },
      {
        type: "checkbox",
        name: "Checkbox",
      },
      {
        type: "label",
        name: "Label",
      },
    ],
  },
  {
    name: "Layout",
    widgets: [
      { type: "grid", name: "Grid" },
      { type: "tab", name: "Tab" },
      {
        type: "list",
        name: "List",
      },
    ],
  },
];

export const labelCol = { span: 8 };
