import React from "react";
import { GameAction, PlayerEntry, Room } from "system/GameStates/GameTypes";
import { getDefaultRoom } from "system/GameStates/RoomGenerator";
import { ListenerTypes } from "system/types/CommonTypes";

export enum UpdateType {
  Insert = "insert",
  Delete = "delete",
  Update = "update",
}
export enum ActionPerformer {
  Pier,
  Client,
}
export type RoomContextType = {
  room: Room;
  onRoomLoaded: (snapshot: Room) => void;
  onUpdatePlayer: (playerEntry: PlayerEntry, utype: UpdateType) => void;
  onUpdateGameAction: (action: GameAction, performer: ActionPerformer) => void;
  onUpdateField: (field: ListenerTypes, data: any) => void;
};

const RoomContext = React.createContext<RoomContextType>({
  room: getDefaultRoom(),
  onRoomLoaded: (snapshot: Room) => {},
  onUpdatePlayer: (playerEntry: PlayerEntry, utype: UpdateType) => {},
  onUpdateGameAction: (action: GameAction, performer: ActionPerformer) => {},
  onUpdateField: (field: ListenerTypes, data: any) => {},
});
export default RoomContext;
