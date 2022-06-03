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
    const [roomCode, setRoomCode] = useState<number>(0);

    /**
     * If any id field is not length 0 but not in player Map,
     * show some other board.
     * and host should clean up to new turnstate and clean action board
     * send message that turn is reset
     *
     */

    function checkSanity() {
        if (myId === ctx.room.header.hostId) {
            ReferenceManager.updateReference(DbReferences.GAME_action, ctx.room.game.action);
            ReferenceManager.updateReference(DbReferences.GAME_state, ctx.room.game.state);
            ReferenceManager.updateReference(DbReferences.HEADER_hostId, myId);
        }
    }

    useEffect(() => {
        console.log("Host ID = " + ctx.room.header.hostId);
        checkSanity();
        setRoomCode((n) => n++);
    }, [ctx.room.playerMap.size]);

    useEffect(() => {
        console.log(`In game id ${myId}`);
        if (myId === null) {
            history.replace("/");
        }
    }, [myId, history]);
    if (myId === null) {
        return <p>Loading...</p>;
    }


    return <div className={classes.container}>
        <HorizontalLayout>
            <VerticalLayout className={`${gc.flex1}`}>
                <PlayerBoard/>
                <MyBoard/>
            </VerticalLayout>
            <VerticalLayout className={`${gc.flex2}`}>
                <MainTableBoard/>
                <ActionBoards code={roomCode}/>
            </VerticalLayout>
            <VerticalLayout className={`${gc.flex1}`}>
                <GameDeckBoard/>
                <InGameChatBoard/>
            </VerticalLayout>
        </HorizontalLayout>
    </div>;

}
