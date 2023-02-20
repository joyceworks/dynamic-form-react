import { Interactions } from "./hooks/interactions";
import {Option} from "../schema";

export type CellDataValue = unknown;

export interface CellDataValueObject {
  [key: string]: CellDataValue;
}

export interface CellData {
  defaultValue?: unknown;
  disabled?: boolean;
  active?: boolean;
  // options?: Option[];
  value?: CellDataValue;
  id: string;
  type: CellDataType | string;
  // lanes?: LaneData[];
  // tabs?: string[];
  label?: string;
  placeholder?: string;
  labeled?: boolean;
  warnable?: boolean;
  warning?: string;
  required?: boolean | (() => boolean);
  onClick?: () => void;
  onChange?: (
    value: CellDataValue,
    interactions: Interactions,
    valueObject?: CellDataValueObject,
    location?: SwimlaneLocation
  ) => void;
  width?: string | number;
  unique?: boolean;

  [key: string]: any;
}

export interface LanedCellData extends CellData {
  lanes: LaneData[];
}

export interface TabCellData extends LanedCellData {
  tabs: string[];
}

export interface WidgetData {
  type: string;
  icon?: JSX.Element;
  name: string;
  mode?: "copy" | "move";
  createWidgetInstance?: () => CellData;
}

export interface SwimlaneLocation {
  parentId: string;
  index: number;
}

export interface LaneData {
  cellDataList: CellData[];
  span?: number;
  hiddenValues?: { [key: string]: CellDataValue };
}

export interface CellLocation {
  parentId: string;
  laneIndex: number;
  index: number;
}

export interface ConstrainViolation {
  id: string;
  message: string;
  value: CellDataValue;
  description: "required" | "format";
}

export interface CellProps {
  data: CellData;
  layout?: "vertical" | "horizontal";
  onChange: (value: CellDataValue, valueObject?: CellDataValueObject) => void;
}

export interface DispatchActiveProps {
  id: string;
  type: "ACTIVE";
}

export interface DispatchEditProps {
  id: string;
  type: "EDIT";
}

export interface DispatchSetValueProps {
  type: "SET_VALUE";
  targetId: string;
  value: any;
}

export interface DispatchSetOptionProps {
  targetId: string;
  type: "SET_OPTION";
  options: Option[];
}

export interface DispatchValidateProps {
  type: "VALIDATE";
}

export interface DispatchInitProps {
  type: "INIT";
  data: CellData;
}

// Move to a swimlane with position
export interface DispatchPositionedMoveProps {
  type: "POSITIONED_MOVE";
  id: string;
  position: "up" | "down";
  dropItemId: string;
}

// Move to a swimlane without position
export interface DispatchMoveProps {
  type: "MOVE";
  id: string;
  location: SwimlaneLocation;
}

// Add to a swimlane with position
export interface DispatchPositionedAddProps {
  type: "POSITIONED_ADD";
  position: "up" | "down";
  dragItem: CellData;
  dropItemId: string;
}

// Add to a swimlane without position(append to last)
export interface DispatchAddProps {
  type: "ADD";
  dragItem: CellData;
  location: SwimlaneLocation;
}

export interface DispatchUpdateProps {
  type: "UPDATE";
  data: CellData;
  id?: string;
}

export interface DispatchDeleteActiveProps {
  type: "DELETE_ACTIVE";
}

export interface DispatchDeleteProps {
  type: "DELETE";
  id: string;
}

export interface DispatchSetProps {
  type: "SET";
  targetId: string;
  value: any;
  key: string;
}

export interface DispatchDeleteLaneProps {
  type: "DELETE_LANE";
  parentId: string;
  index: number;
}

export type CellDataType =
  | "textarea"
  | "select"
  | "datetime"
  | "grid"
  | "list"
  | "tab"
  | "checkbox"
  | "label"
  | "switch"
  | "input";

export type ReducerActionProps =
  | DispatchPositionedMoveProps
  | DispatchPositionedAddProps
  | DispatchActiveProps
  | DispatchEditProps
  | DispatchMoveProps
  | DispatchAddProps
  | DispatchUpdateProps
  | DispatchDeleteActiveProps
  | DispatchDeleteProps
  | DispatchSetValueProps
  | DispatchSetProps
  | DispatchValidateProps
  | DispatchInitProps
  | DispatchSetOptionProps
  | DispatchDeleteLaneProps;
