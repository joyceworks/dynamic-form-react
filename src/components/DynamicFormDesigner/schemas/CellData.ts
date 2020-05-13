import { SwimlaneData } from "./SwimlaneData";

export interface CellData {
  active: boolean;
  options?: { value: any; label: string }[];
  value?: any;
  id: string;
  type: string;
  swimlanes?: SwimlaneData[];
  label?: string;
  placeholder?: string;
  labeled?: boolean;
  warningable?: boolean;
  warning?: string;
  required?: boolean;
}
