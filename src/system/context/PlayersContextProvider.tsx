import { IProps } from "App";
import { useReducer } from "react";
import PlayersContext, {
  PlayersContextType,
} from "system/context/players-context";
import { getDefaultAction } from "system/Database/RoomDatabase";
import { Room } from "system/GameStates/GameTypes";
type RoomStateType = {
  room: Room;
};
enum PlayersContextAction {
  RoomLoaded,
  Joined,
  Disconnected,
  LocalJoined,
  LocalDisconnected,
  UpdateTurn,
}
type PlayersActionType = {
  id?: string;
  type: PlayersContextAction;
  param?: any;
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
    hostId: null,
  },
};

function playersReducer(
  prevState: RoomStateType,
  action: PlayersActionType
): RoomStateType {
  switch (action.type) {
    case PlayersContextAction.RoomLoaded:
      return {
        room: action.param,
      };
    default:
      return defaultRoomState;
  }
}

export default function PlayersProvider(props: IProps) {
  const [playersState, dispatchPlayersState] = useReducer(
    playersReducer,
    defaultRoomState
  );

  function onPlayerJoin() {
    dispatchPlayersState({
      type: PlayersContextAction.Joined,
    });
  }
  function onPlayerDisconnect() {
    dispatchPlayersState({
      type: PlayersContextAction.Joined,
    });
  }
  function onLocalPlayerJoin() {
    dispatchPlayersState({
      type: PlayersContextAction.Joined,
    });
  }
  function onLocalPlayerDisconnect() {
    dispatchPlayersState({
      type: PlayersContextAction.Joined,
    });
  }
  function onRoomLoaded(room: Room) {
    dispatchPlayersState({
      type: PlayersContextAction.Joined,
      param: room,
    });
  }

  const roomContext: PlayersContextType = {
    room: playersState.room,
    onRoomLoaded,
    onPlayerJoin,
    onPlayerDisconnect,
    onLocalPlayerJoin,
    onLocalPlayerDisconnect,
  };

  return (
    <PlayersContext.Provider value={roomContext}>
      {props.children}
    </PlayersContext.Provider>
  );
}
