import React from "react";
import {PlayerEntry, Room} from "system/GameStates/GameTypes";
import {getDefaultRoom} from "system/GameStates/RoomGenerator";
import {ListenerTypes} from "system/types/CommonTypes";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";

export enum UpdateType {
    Insert = "insert",
    Delete = "delete",
    Update = "update",
}

const RoomContext = React.createContext<RoomContextType>({
    room: getDefaultRoom(),
    onRoomLoaded: (snapshot: Room) => {
    },
    onUpdatePlayer: (playerEntry: PlayerEntry, utype: UpdateType) => {
    },
    onUpdateField: (field: ListenerTypes, data: any) => {
    },
});
export default RoomContext;
