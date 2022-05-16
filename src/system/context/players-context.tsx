import React from "react";
import { getDefaultAction } from "system/Database/RoomDatabase";
import { Room } from "system/GameStates/GameTypes";

export type PlayersContextType = {
  room: Room;
  onRoomLoaded: (room: Room) => void;
  onPlayerJoin: (id: string) => void;
  onPlayerDisconnect: (id: string) => void;
  onLocalPlayerJoin: (id: string) => void;
  onLocalPlayerDisconnect: (id: string) => void;
};

const PlayersContext = React.createContext<PlayersContextType>({
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
  onRoomLoaded: () => {},
  onPlayerJoin: () => {},
  onPlayerDisconnect: () => {},
  onLocalPlayerJoin: () => {},
  onLocalPlayerDisconnect: () => {},
});
export default PlayersContext;
