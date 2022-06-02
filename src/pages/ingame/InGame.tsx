import HorizontalLayout from "../components/ui/HorizontalLayout";
import VerticalLayout from "../components/ui/VerticalLayout";
import classes from "./InGame.module.css";
import gc from "../../global.module.css";
import PlayerBoard from "./Left/PlayerBoard/PlayerBoard";
import MyBoard from "./Left/MyBoard/MyBoard";
import MainTableBoard from "./Center/MainTableBoard/MainTableBoard";
import ActionBoards from "./Center/ActionBoards/ActionBoards";
import GameDeckBoard from "./Right/GameDeckBoard/GameDeckBoard";
import InGameChatBoard from "./Right/ChatBoard/InGameChatBoard";
import {useContext, useEffect, useState} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {useHistory} from "react-router-dom";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";


export default function InGame() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();
    const myId = localCtx.getVal(LocalField.Id);
    const [validState, setIsValidState] = useState<boolean>(true);

    /**
     * If any id field is not length 0 but not in player Map,
     * show some other board.
     * and host should clean up to new turnstate and clean action board
     * send message that turn is reset
     *
     */

    function checkHostIsAlive(): boolean {
        const valid = ctx.room.playerMap.has(ctx.room.header.hostId);
        if (!valid) {
            if (myId === ctx.room.playerList[0]) {
                ReferenceManager.updateReference(DbReferences.GAME_action, ctx.room.game.action);
                ReferenceManager.updateReference(DbReferences.GAME_state, ctx.room.game.state);
                ReferenceManager.updateReference(DbReferences.HEADER_hostId, myId);
            }
        }
        if (!valid)
            console.log("Failed host");
        return valid;
    }

    useEffect(() => {
        console.log("Host ID = " + ctx.room.header.hostId);
        const checks = checkHostIsAlive();
        setIsValidState(checks);
    }, [ctx.room.header.hostId]);
    //TODO but how do we detect if something is wrong?
    //Just CHange host to null when it is wrong.

    useEffect(() => {
        console.log(`In game id ${myId}`);
        if (myId === null) {
            history.replace("/");
        }
    }, [myId, history]);
    if (myId === null) {
        return <p>Loading...</p>;
    }


    if (validState) {
        return <div className={classes.container}>
            <HorizontalLayout>
                <VerticalLayout className={`${gc.flex1}`}>
                    <PlayerBoard/>
                    <MyBoard/>
                </VerticalLayout>
                <VerticalLayout className={`${gc.flex2}`}>
                    <MainTableBoard/>
                    <ActionBoards/>
                </VerticalLayout>
                <VerticalLayout className={`${gc.flex1}`}>
                    <GameDeckBoard/>
                    <InGameChatBoard/>
                </VerticalLayout>
            </HorizontalLayout>
        </div>;
    } else {
        return <p>Someone left the game. Room will be modified...</p>;

    }
}
