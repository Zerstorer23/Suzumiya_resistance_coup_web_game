import React from "react";

export type ContextFieldType<T> = {
  val: T | null;
  set: (nv: T) => void;
};
export type LocalContextType = {
  map: Map<any, ContextFieldType<any>>;
  getVal: (field: LocalField) => any;
  setVal: (field: LocalField, val: any) => void;
};
export enum LocalField {
  Id,
  SortedList,
}
const LocalContext = React.createContext<LocalContextType>({
  map: new Map(),
  getVal: (field: LocalField) => {},
  setVal: (field: LocalField, val: any) => {},
});
// ({
// myId: null,
// setMyId: () => {},
// });
export default LocalContext;
