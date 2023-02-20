import { CellData } from "../../../schema";
import {Option} from "../../../../schema";

export interface SelectCellData extends CellData {
  options: Option[];
}
