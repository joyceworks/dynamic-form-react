import { LaneData } from "./LaneData";

export interface CellData {
  disabled?: boolean;
  active?: boolean;
  options?: { value: any; label: string }[];
  value?: any;
  id: string;
  type: string;
  lanes?: LaneData[];
  label?: string;
  placeholder?: string;
  labeled?: boolean;
  warnable?: boolean;
  warning?: string;
  required?: boolean;
}
