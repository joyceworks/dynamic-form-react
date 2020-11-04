import { CellDataType } from "../type";
import { Interactions } from "../hooks/interactions";

export interface CellData {
  defaultValue?: any;
  disabled?: boolean;
  active?: boolean;
  options?: { value: any; label: string }[];
  value?: any;
  id: string;
  type: CellDataType | string;
  lanes?: LaneData[];
  tabs?: string[];
  label?: string;
  placeholder?: string;
  labeled?: boolean;
  warnable?: boolean;
  warning?: string;
  required?: boolean | (() => boolean);
  onClick?: () => void;
  onChange?: (
    value: any,
    interactions: Interactions,
    valueObject?: any,
    location?: SwimlaneLocation
  ) => void;
  width?: string | number;

  [key: string]: any;
}

export interface WidgetData {
  type: string;
  icon: JSX.Element;
  name: string;
  mode?: "copy" | "move";
}

export interface SwimlaneLocation {
  parentId: string;
  index: number;
}

export interface LaneData {
  cellDataList: CellData[];
  span?: number;
  hiddenValues?: { [key: string]: any };
}

export interface CellLocation {
  parentId: string;
  laneIndex: number;
  index: number;
}

export interface ConstrainViolation {
  id: string;
  message: string;
  value: any;
  description: "required";
}

export interface CellProps {
  data: CellData;
  layout?: "vertical" | "horizontal";
  onChange: (value: any, valueObject?: any) => void;
}
