import React, { useCallback, useContext } from "react";
import { CellData } from "../schema";
import CellTextPropConfig from "./CellTextPropConfig";
import cnchar from "cnchar";
import { DesignerContext } from "../Designer";
import { InteractionContext } from "../util";
import { Interactions } from "../hooks/interactions";

const CellLabelConfig = ({ data }: { data: CellData }): JSX.Element => {
  const designerDispatch = useContext(DesignerContext);
  const interactionContext = useContext<Interactions>(InteractionContext);
  const handleChange = useCallback(
    (value) => {
      if (!value) {
        return;
      }
      if (/^-?\d+$/.test(data.id)) {
        let id: string = cnchar.spell(value, "first", "low") as string;
        let exist = !!interactionContext.get(id, "id");
        if (exist) {
          for (let i = 1; i < Number.MAX_VALUE; i++) {
            id = id + i;
            exist = !!interactionContext.get(id, "id");
            if (!exist) {
              break;
            }
          }
        }

        designerDispatch({
          type: "SET",
          key: "id",
          value: id,
          targetId: data.id,
        });
      }
    },
    [data.id, designerDispatch, interactionContext]
  );
  return (
    <CellTextPropConfig
      onChange={handleChange}
      data={data}
      label={"标题"}
      prop={"label"}
    />
  );
};

export default CellLabelConfig;
