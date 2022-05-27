import firebase from "firebase/compat/app";
import { Room } from "system/GameStates/GameTypes";
export type IProps = {
  className?: string;
  children?: JSX.Element[] | JSX.Element;
};

export type ItemPair = {
  key: string;
  label: string;
  value: string;
};
export type FlexPair = {
  element: JSX.Element;
  flex: number;
};
export type Snapshot = firebase.database.DataSnapshot;

export enum LoadStatus {
  init = "Initialising",
  isLoading = "Loading room",
  loaded = "Room loadd",
  listening = "Listening changes",
  joined = "Joined room",
  outerSpace = "A outer space",
}
export type voidReturn = () => void;
export type DbRef = firebase.database.Reference;
export type LinearParam = IProps & { elements: FlexPair[] };

export enum ListenerTypes {
  Deck,
  Pier,
  Client,
  State,
  PlayerList,
  Header,
}
export type Listeners = Map<ListenerTypes, DbRef>;

export const LISTEN_VALUE = "value";
export const LISTEN_CHILD_ADDED = "child_added";
export const LISTEN_CHILD_REMOVED = "child_removed";
export const LISTEN_CHILD_CHANGED = "child_changed";
export const LISTEN_CHILD_MOVED = "child_moved";
