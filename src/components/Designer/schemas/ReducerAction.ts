import { CellData } from "./CellData";
import SwimlaneLocation from "./SwimlaneLocation";

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
  target: CellData;
  value: any;
}

export interface DispatchValidateProps {
  type: "VALIDATE";
}

export interface DispatchInitProps {
  type: "INIT";
  data: CellData;
}

// Move to a swimlane with position
export interface DispatchPositionedMove {
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
}

export interface DispatchDeleteActiveProps {
  type: "DELETE_ACTIVE";
}
