import React from "react";

export type ContextFieldType<T> = {
  val: T | null;
  set: (nv: T) => void;
};
export type LocalContextType = Map<any, ContextFieldType<any>>;
export enum LocalField {
  Id,
  SortedList,
}
const LocalContext = React.createContext<LocalContextType>(new Map());
// ({
// myId: null,
// setMyId: () => {},
// });
export default LocalContext;
