import React, { useCallback } from "react";
import { ReducerActionProps } from "../type";
import { CellData } from "../schema";
import { getValue as fetchValue } from "../util";

export interface Interactions {
  setValue: (id: string, value: any) => void;
  setOption: (id: string, options: { value: any; label: string }[]) => void;
  getValue: (id: string) => any;
  set: (id: string, key: string, value: any) => void;
}

export default function useInteractions(
  dispatch: React.Dispatch<ReducerActionProps>,
  root: CellData
): Interactions {
  const setValue = useCallback(
    (id: string, value: any) => {
      dispatch({
        type: "SET_VALUE",
        targetId: id,
        value,
      });
    },
    [dispatch]
  );
  const setOption = useCallback(
    (id: string, options: { value: any; label: string }[]) => {
      dispatch({
        type: "SET_OPTION",
        options: options,
        targetId: id,
      });
    },
    [dispatch]
  );
  const getValue = useCallback(
    (id: string): any => {
      return fetchValue(root, id);
    },
    [root]
  );
  const set = useCallback(
    (id: string, key: string, value: any) => {
      dispatch({
        type: "SET",
        targetId: id,
        key,
        value,
      });
    },
    [dispatch]
  );
  return { setValue, setOption, getValue, set };
}
