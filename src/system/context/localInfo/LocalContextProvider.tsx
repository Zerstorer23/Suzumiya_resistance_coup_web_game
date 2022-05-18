import { useState } from "react";
import LocalContext, {
  LocalContextType,
} from "system/context/localInfo/local-context";
import { IProps } from "system/types/CommonTypes";

export default function LocalProvider(props: IProps) {
  const [myId, setMyId] = useState(null);

  const context: LocalContextType = {
    myId,
    setMyId,
  };

  return (
    <LocalContext.Provider value={context}>
      {props.children}
    </LocalContext.Provider>
  );
}
