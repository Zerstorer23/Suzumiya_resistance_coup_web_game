import React from "react";

export type LocalContextType = {
  myId: string | null;
  setMyId: any;
};

const LocalContext = React.createContext<LocalContextType>({
  myId: null,
  setMyId: () => {},
});
export default LocalContext;
