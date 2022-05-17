import { IProps } from "App";
import firebase from "firebase/compat/app";
import { Room } from "system/GameStates/GameTypes";

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

export enum ListenerTypes {
  Deck,
  Pier,
  Client,
  Seed,
  Turn,
  PlayerList,
  EachPlayer,
}
// export type DbSnapshot = {
//   room: Room;
//   listeners: Listeners;
// };
export type Listeners = Map<ListenerTypes, DbRef>;
export type PlayerListeners = Map<string, DbRef>;
//export type PlayerListenerMap = Map<string, DbRef>;
// export type GameListenerMap = {
//   deckListener: DbRef;
//   pierListener: DbRef;
//   clientListener: DbRef;
//   seedListener: DbRef;
//   turnListener: DbRef;
// } | null;
