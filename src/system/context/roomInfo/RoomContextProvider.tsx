import {useReducer} from "react";
import RoomContext, {UpdateType,} from "system/context/roomInfo/room-context";
import {KillInfo, PlayerEntry, Room} from "system/GameStates/GameTypes";
import {getDefaultRoom, getSortedListFromMap} from "system/GameStates/RoomGenerator";
import {IProps, ListenerTypes} from "system/types/CommonTypes";
import {isSafe} from "system/GameConstants";
import {BoardState} from "system/GameStates/States";

/* Room Context
Holds data 1 to 1 match to DB.
DataLoader loads Data into local, this broadcasts that data to all other components
Use ReferenceManager to uploadData
*/
export type RoomContextType = {
    room: Room;
    onRoomLoaded: (snapshot: Room) => void;
    onUpdatePlayer: (playerEntry: PlayerEntry, utype: UpdateType) => void;
    onUpdateField: (field: ListenerTypes, data: any) => void;
};

enum RoomContextAction {
    RoomLoaded,
    PlayerUpdated,
    FieldUpdated,
}

type RoomActionType = {
    id?: string;
    type: RoomContextAction;
    room?: Room;
    mainParam?: any;
    sideParam?: any;
};

function checkGhostPlayers(room: Room): boolean {
    const ids = [
        room.game.action.pierId, room.game.action.targetId,
        room.game.action.challengerId,
    ];
    if (typeof (room.game.action.param) === 'object') {
        const info = room.game.action.param as KillInfo;
        ids.push(info.ownerId);
    }
    let isOkay = true;
    for (const id of ids) {
        if (!isSafe(id, room.playerMap)) {
            isOkay = false;
            break;
        }
    }
    return isOkay;
}

function resetState(room: Room) {
    room.game.action.param = "";
    room.game.action.pierId = "";
    room.game.action.challengerId = "";
    room.game.action.targetId = "";
    room.game.state.board = BoardState.ChoosingBaseAction;
}


function handlePlayerUpdate(newRoom: Room, action: RoomActionType) {
    const updateType = action.sideParam;
    const entry = action.mainParam as PlayerEntry;
    switch (updateType) {
        case UpdateType.Update:
        case UpdateType.Insert:
            newRoom.playerMap.set(entry.id, entry.player);
            newRoom.playerList = getSortedListFromMap(newRoom.playerMap);
            break;
        case UpdateType.Delete:
            newRoom.playerMap.delete(entry.id);
            newRoom.playerList = getSortedListFromMap(newRoom.playerMap);
            if (entry.id === newRoom.header.hostId) {
                newRoom.header.hostId = "";
                console.log("Detected host disconnect " + newRoom.header.hostId);
            }
            if (!checkGhostPlayers(newRoom)) {
                //need reset
                resetState(newRoom);
                console.log("Detected ghost player ");
                console.log(newRoom);
            }
            if (newRoom.game.state.turn >= newRoom.playerMap.size) {
                newRoom.game.state.board = BoardState.ChoosingBaseAction;
                newRoom.game.state.turn = newRoom.game.state.turn % newRoom.playerMap.size;
                console.log("Detected invalid turn");
            }
            break;
    }
}

function handleFieldUpdate(newRoom: Room, action: RoomActionType) {
    const fieldType: ListenerTypes = action.mainParam;
    switch (fieldType) {
        case ListenerTypes.gameAction:
            newRoom.game.action = action.sideParam;
            break;
        case ListenerTypes.Deck:
            newRoom.game.deck = action.sideParam;
            break;
        case ListenerTypes.Header:
            newRoom.header = action.sideParam;
            break;
        case ListenerTypes.PlayerList:
            newRoom.playerMap = action.sideParam;
            break;
        case ListenerTypes.State:
            newRoom.game.state = action.sideParam;
            break;
    }
}

function roomReducer(prevRoom: Room, action: RoomActionType): Room {
    let newRoom: Room = {
        ...prevRoom,
    };
    switch (action.type) {
        case RoomContextAction.RoomLoaded:
            newRoom = action.room!;
            newRoom.playerList = getSortedListFromMap(newRoom.playerMap);
            break;
        case RoomContextAction.PlayerUpdated:
            handlePlayerUpdate(newRoom, action);
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

    // useImmerReducer(roomImmerReducer, getDefaultRoom());

    function onRoomLoaded(snapshot: Room) {
        const param = {
            type: RoomContextAction.RoomLoaded,
            room: snapshot,
        };
        dispatchRoomState(param);
    }

    function onUpdatePlayer(entry: PlayerEntry, utype: UpdateType) {
        const param: RoomActionType = {
            type: RoomContextAction.PlayerUpdated,
            mainParam: entry,
            sideParam: utype,
        };
        dispatchRoomState(param);
    }

    function onUpdateField(field: ListenerTypes, data: any) {
        const param: RoomActionType = {
            type: RoomContextAction.FieldUpdated,
            mainParam: field,
            sideParam: data,
        };
        /*        console.log("Field updated " + field);
                console.log(data);*/
        dispatchRoomState(param);
    }

    const roomContext: RoomContextType = {
        room: roomState,
        onRoomLoaded,
        onUpdatePlayer,
        onUpdateField,
    };

    return (
        <RoomContext.Provider value={roomContext}>
            {props.children}
        </RoomContext.Provider>
    );
}
