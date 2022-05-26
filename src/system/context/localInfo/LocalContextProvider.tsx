import { useState } from "react";
import LocalContext, {
  LocalContextType,
  LocalField,
} from "system/context/localInfo/local-context";
import { IProps } from "system/types/CommonTypes";

export default function LocalProvider(props: IProps) {
  const [myId, setMyId] = useState(null);
  const [sortedPlayerList, setSortedPlayerList] = useState([]);

  const context: LocalContextType = new Map();
  context.set(LocalField.Id, {
    val: myId,
    set: setMyId,
  });
  context.set(LocalField.SortedList, {
    val: sortedPlayerList,
    set: setSortedPlayerList,
  });

  return (
    <LocalContext.Provider value={context}>
      {props.children}
    </LocalContext.Provider>
  );
}
