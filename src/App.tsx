import React, { useMemo } from "react";
import "./App.css";
import { Designer } from "./components/Form/Designer";
import SelectCellConfig from "./components/SelectCell/SelectCellConfig";
import { SelectCell } from "./components/SelectCell";
import { CellData } from "./components/Form/schema";
import { CustomCell } from "./components/Form/Designer/Cell";
import DateCellConfig from "./components/DateCell/DateCellConfig";
import { DateCell } from "./components/DateCell";
import CheckboxCellConfig from "./components/Form/CheckboxCell/CheckboxCellConfig";
import CheckboxCell from "./components/Form/CheckboxCell";
import { SwitchCell } from "./components/SwitchCell";
import { LabelCell } from "./components/LabelCell/LabelCell";
import LabelCellConfig from "./components/LabelCell/LabelCellConfig";
import { InputCell } from "./components/InputCell/InputCell";

function App() {
  const customCells = useMemo(
    (): CustomCell[] => [
      {
        name: "Select",
        type: "select",
        config: SelectCellConfig,
        cell: SelectCell,
        createWidgetInstance() {
          let cellData: CellData = {
            type: "select",
            id: `select${new Date().getTime()}`,
            active: false,
          };
          cellData.label = "Select";
          cellData.placeholder = "Select...";
          cellData.options = [];
          cellData.required = false;
          return cellData;
        },
      },
      {
        name: "Datepicker",
        type: "datetime",
        config: DateCellConfig,
        cell: DateCell,
        createWidgetInstance() {
          let cellData: CellData = {
            type: "datetime",
            id: `datetime${new Date().getTime()}`,
            active: false,
          };
          cellData.label = "Date";
          cellData.placeholder = "Select...";
          cellData.required = false;
          return cellData;
        },
      },
      {
        name: "Checkbox",
        type: "checkbox",
        config: CheckboxCellConfig,
        cell: CheckboxCell,
        createWidgetInstance() {
          let cellData: CellData = {
            type: "checkbox",
            id: `checkbox${new Date().getTime()}`,
            active: false,
          };
          cellData.label = "Checkbox";
          cellData.options = [];
          cellData.required = false;
          return cellData;
        },
      },
      {
        name: "Switch",
        type: "switch",
        cell: SwitchCell,
        createWidgetInstance() {
          let cellData: CellData = {
            type: "switch",
            id: `switch${new Date().getTime()}`,
            active: false,
            label: "Switch",
          };
          return cellData;
        },
      },
      {
        name: "Label",
        type: "label",
        cell: LabelCell,
        config: LabelCellConfig,
        createWidgetInstance() {
          let cellData: CellData = {
            type: "label",
            id: `label${new Date().getTime()}`,
            active: false,
            label: "Label",
          };
          return cellData;
        },
      },
      {
        name: "Input",
        type: "input",
        cell: InputCell,
        createWidgetInstance() {
          let cellData: CellData = {
            type: "input",
            id: `input${new Date().getTime()}`,
            active: false,
          };
          cellData.label = "Input";
          cellData.placeholder = "Input...";
          cellData.required = false;
          return cellData;
        },
      },
    ],
    []
  );
  return <Designer customCells={customCells} />;
}

export default App;
