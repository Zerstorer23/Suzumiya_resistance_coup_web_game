import { IProps } from "App";
import firebase from "firebase/compat/app";

export type ItemPair = {
  key: string;
  label: string;
  value: string;
};
export type FlexPair = {
  element: JSX.Element;
  flex: number;
};

export type voidReturn = () => void;
export type DbRef = firebase.database.Reference;
export type LinearParam = IProps & { elements: FlexPair[] };
export type PlayerListenerMap = Map<string, DbRef>;
export type GameListenerMap = {
  deckListener: DbRef;
  pierListener: DbRef;
  clientListener: DbRef;
  seedListener: DbRef;
  turnListener: DbRef;
};
