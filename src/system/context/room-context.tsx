import React from "react";
import { RoomStateType } from "system/context/RoomContextProvider";
import { getDefaultAction } from "system/Database/RoomDatabase";
import { Player, Room } from "system/GameStates/GameTypes";
import { Listeners, PlayerListeners } from "system/types/CommonTypes";

export type RoomContextType = {
  room: Room;
  listeners: Listeners;
  playerListeners: PlayerListeners;
  onRoomLoaded: (snapshot: RoomStateType) => void;
  onUpdatePlayer: (player: Player) => void;
  onPlayerJoin: (id: string) => void;
  onPlayerDisconnect: (id: string) => void;
};

const RoomContext = React.createContext<RoomContextType>({
  room: {
    playerList: [],
    game: {
      currentTurn: -1,
      deck: "",
      pierAction: getDefaultAction(),
      clientAction: getDefaultAction(),
      seed: 0,
    },
    hostId: null,
  },
  listeners: new Map(),
  playerListeners: new Map(),
  onRoomLoaded: (snapshot: RoomStateType) => {},
  onUpdatePlayer: (player: Player) => {},
  onPlayerJoin: () => {},
  onPlayerDisconnect: () => {},
});
export default RoomContext;
