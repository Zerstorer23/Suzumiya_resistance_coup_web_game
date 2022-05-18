import { useReducer } from "react";
import RoomContext, {
  ActionPerformer,
  RoomContextType,
  UpdateType,
} from "system/context/room-context";
import { GameAction, PlayerEntry, Room } from "system/GameStates/GameTypes";
import { getDefaultRoom } from "system/GameStates/RoomGenerator";
import { IProps, ListenerTypes } from "system/types/CommonTypes";
enum RoomContextAction {
  RoomLoaded,
  PlayerUpdated,
  GameActionUpdated,
  FieldUpdated,
}
type RoomActionType = {
  id?: string;
  type: RoomContextAction;
  room?: Room;
  mainParam?: any;
  sideParam?: any;
};

// export type RoomStateType = {
//   room: Room;
// };

// export const defaultRoomState: RoomStateType = {
//   room: getDefaultRoom(),
// };

function handlePlayerUpdate(newRoom: Room, action: RoomActionType) {
  const updateType = action.sideParam;
  const entry = action.mainParam as PlayerEntry;
  switch (updateType) {
    case UpdateType.Update:
    case UpdateType.Insert:
      newRoom.playerMap.set(entry.id, entry.player);
      break;
    case UpdateType.Delete:
      newRoom.playerMap.delete(entry.id);
      break;
  }
}
function handleGameActionUpdate(newRoom: Room, action: RoomActionType) {}
function handleFieldUpdate(newRoom: Room, action: RoomActionType) {}

function roomReducer(prevRoom: Room, action: RoomActionType): Room {
  let newRoom: Room = {
    game: prevRoom.game,
    header: prevRoom.header,
    playerMap: prevRoom.playerMap,
  };
  switch (action.type) {
    case RoomContextAction.RoomLoaded:
      newRoom = action.room!;
      break;
    case RoomContextAction.PlayerUpdated:
      handlePlayerUpdate(newRoom, action);
      break;
    case RoomContextAction.GameActionUpdated:
      handleGameActionUpdate(newRoom, action);
      break;
    case RoomContextAction.FieldUpdated:
      handleFieldUpdate(newRoom, action);
      break;
    default:
      return getDefaultRoom();
  }
  return newRoom;
}

export default function RoomProvider(props: IProps) {
  const [roomState, dispatchRoomState] = useReducer(
    roomReducer,
    getDefaultRoom()
  );

  function onRoomLoaded(snapshot: Room) {
    const param = {
      type: RoomContextAction.RoomLoaded,
      room: snapshot,
    };
    console.log("Room loaded : ");
    console.log(snapshot);
    dispatchRoomState(param);
  }
  function onUpdatePlayer(entry: PlayerEntry, utype: UpdateType) {
    const param: RoomActionType = {
      type: RoomContextAction.PlayerUpdated,
      mainParam: entry,
      sideParam: utype,
    };
    console.log(
      `Player updated:  ${entry.id}/ ${entry.player.name} utype ${utype}`
    );
    dispatchRoomState(param);
  }
  function onUpdateGameAction(action: GameAction, performer: ActionPerformer) {
    const param: RoomActionType = {
      type: RoomContextAction.GameActionUpdated,
      mainParam: action,
      sideParam: performer,
    };
    console.log("Game Action Updated " + action.id + " / " + performer);
    dispatchRoomState(param);
  }

  function onUpdateField(field: ListenerTypes, data: any) {
    const param: RoomActionType = {
      type: RoomContextAction.FieldUpdated,
      mainParam: field,
      sideParam: data,
    };
    console.log("Field updated " + field);
    console.log(data);
    dispatchRoomState(param);
  }

  const roomContext: RoomContextType = {
    room: roomState,
    onRoomLoaded,
    onUpdatePlayer,
    onUpdateGameAction,
    onUpdateField,
  };

  return (
    <RoomContext.Provider value={roomContext}>
      {props.children}
    </RoomContext.Provider>
  );
}
