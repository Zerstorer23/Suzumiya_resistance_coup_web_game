import { useState } from "react";
import LocalContext, {
  LocalContextType,
  LocalField,
} from "system/context/localInfo/local-context";
import { IProps } from "system/types/CommonTypes";

export default function LocalProvider(props: IProps) {
  const [myId, setMyId] = useState(null);
  const [sortedPlayerList, setSortedPlayerList] = useState([]);

  const map = new Map();
  map.set(LocalField.Id, {
    val: myId,
    set: setMyId,
  });
  map.set(LocalField.SortedList, {
    val: sortedPlayerList,
    set: setSortedPlayerList,
  });
  const context: LocalContextType = {
    map,
    // get: (field: LocalField) => {
    //   return map.get(field)!;
    // },
    getVal: (field: LocalField) => {
      return map.get(field).val!;
    },
    setVal: (field: LocalField, val: any) => {
      map.get(field).set(val);
    },
  };
  return (
    <LocalContext.Provider value={context}>
      {props.children}
    </LocalContext.Provider>
  );
}
