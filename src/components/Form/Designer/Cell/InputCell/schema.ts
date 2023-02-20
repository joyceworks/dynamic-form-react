import { CellData } from "../../../schema";

export interface InputCellData extends CellData {
  format: string;
  customFormat: string;
}
