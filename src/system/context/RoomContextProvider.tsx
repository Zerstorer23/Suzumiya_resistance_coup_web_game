import { IProps } from "App";
import { useReducer } from "react";
import RoomContext, { RoomContextType } from "system/context/room-context";
import { getDefaultAction } from "system/Database/RoomDatabase";
import { Player, Room } from "system/GameStates/GameTypes";
import { Listeners, PlayerListeners } from "system/types/CommonTypes";
enum RoomContextAction {
  RoomLoaded,
  PlayerUpdated,
  Joined,
  Disconnected,
  LocalJoined,
  LocalDisconnected,
  UpdateTurn,
}
type RoomActionType = {
  id?: string;
  type: RoomContextAction;
  room?: Room;
  listeners?: Listeners;
  playerListeners?: PlayerListeners;
  param?: any;
};

export type RoomStateType = {
  room: Room;
  listeners: Listeners;
  playerListeners: PlayerListeners;
};

export const defaultRoomState: RoomStateType = {
  room: {
    playerList: [],
    game: {
      currentTurn: -1,
      deck: "",
      pierAction: getDefaultAction(),
      clientAction: getDefaultAction(),
      seed: 0,
    },
    hostId: "?",
  },
  listeners: new Map(),
  playerListeners: new Map(),
};

export function getPlayerIndexById(id: string, players: Player[]) {
  const index = players.findIndex((value: Player) => {
    return value.id === id;
  });
  return index;
}

function roomReducer(
  prevState: RoomStateType,
  action: RoomActionType
): RoomStateType {
  switch (action.type) {
    case RoomContextAction.RoomLoaded:
      return {
        room: action.room!,
        listeners: action.listeners!,
        playerListeners: action.playerListeners!,
      };
    case RoomContextAction.PlayerUpdated:
      const updatedPlayer = action.param as Player;
      const players = [...prevState.room.playerList];
      const index = getPlayerIndexById(updatedPlayer.id, players);
      players[index] = updatedPlayer;
      const newRoom = prevState.room;
      newRoom.playerList = players;
      return {
        room: newRoom,
        listeners: prevState.listeners!,
        playerListeners: prevState.playerListeners!,
      };
    default:
      return defaultRoomState;
  }
}

export default function RoomProvider(props: IProps) {
  const [RoomState, dispatchRoomState] = useReducer(
    roomReducer,
    defaultRoomState
  );

  function onPlayerJoin() {
    dispatchRoomState({
      type: RoomContextAction.Joined,
    });
  }
  function onPlayerDisconnect() {
    dispatchRoomState({
      type: RoomContextAction.Joined,
    });
  }

  function onRoomLoaded(snapshot: RoomStateType) {
    dispatchRoomState({
      type: RoomContextAction.RoomLoaded,
      room: snapshot.room,
      listeners: snapshot.listeners,
      playerListeners: snapshot.playerListeners,
    });
  }
  function onUpdatePlayer(player: Player) {
    dispatchRoomState({
      type: RoomContextAction.PlayerUpdated,
      param: player,
    });
  }

  const roomContext: RoomContextType = {
    room: RoomState.room,
    listeners: RoomState.listeners,
    playerListeners: RoomState.playerListeners,
    onRoomLoaded,
    onUpdatePlayer,
    onPlayerJoin,
    onPlayerDisconnect,
  };

  return (
    <RoomContext.Provider value={roomContext}>
      {props.children}
    </RoomContext.Provider>
  );
}
