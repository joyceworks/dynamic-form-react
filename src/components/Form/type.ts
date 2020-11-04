import {
  DispatchActiveProps,
  DispatchAddProps,
  DispatchDeleteActiveProps,
  DispatchDeleteProps,
  DispatchEditProps,
  DispatchInitProps,
  DispatchMoveProps,
  DispatchPositionedAddProps,
  DispatchPositionedMoveProps,
  DispatchSetOptionProps,
  DispatchSetProps,
  DispatchSetValueProps,
  DispatchUpdateProps,
  DispatchValidateProps,
} from "./schema/ReducerAction";

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
  | DispatchSetOptionProps;
