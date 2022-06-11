import HorizontalLayout from "../components/ui/HorizontalLayout";
import VerticalLayout from "../components/ui/VerticalLayout";
import classes from "./InGame.module.css";
import PlayerBoard from "./Left/PlayerBoard/PlayerBoard";
import MyBoard from "./Left/MyBoard/MyBoard";
import MainTableBoard from "./Center/MainTableBoard/MainTableBoard";
import ActionBoards from "./Center/ActionBoards/ActionBoards";
import GameDeckBoard from "./Right/GameDeckBoard/GameDeckBoard";
import InGameChatBoard from "./Right/ChatBoard/InGameChatBoard";
import {Fragment, useContext, useEffect, useState} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {useHistory} from "react-router-dom";
import {Navigation} from "App";
import {TurnManager} from "system/GameStates/TurnManager";
import {DS} from "system/Debugger/DS";
import {DeckManager} from "system/cards/DeckManager";
import {DbFields, ReferenceManager} from "system/Database/ReferenceManager";
import TransitionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import gc from "global.module.css";

export default function InGame() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();
    const myId = localCtx.getVal(LocalField.Id);
    const [roomCode, setRoomCode] = useState<number>(0);
    const amHost = TurnManager.amHost(ctx, localCtx);

    function checkSanity(): boolean {
        if (!amHost) return false;
        ReferenceManager.updateReference(
            DbFields.GAME_action,
            ctx.room.game.action
        );
        ReferenceManager.updateReference(
            DbFields.GAME_state,
            ctx.room.game.state
        );
        ReferenceManager.updateReference(DbFields.HEADER_hostId, myId);
        const alive = DeckManager.countAlivePlayers(ctx);
        if (!DS.StrictRules || alive > 1) return true;
        TransitionManager.pushEndGame(ctx, myId);
        return true;
    }

    useEffect(() => {
        const res = checkSanity();
        if (!res) return;
        setRoomCode((n) => n++);
        const alive = DeckManager.countAlivePlayers(ctx);
        if (alive <= 1) {
            TransitionManager.pushEndGame(ctx, myId);
        }
    }, [ctx.room.playerMap.size]);

    useEffect(() => {
        if (myId === null) {
            history.replace(Navigation.Loading);
        }
    }, [myId, history]);
    const turn = ctx.room.game.state.turn;
    useEffect(() => {
        if (turn === -2) {
            history.replace(Navigation.Finished);
        } else if (turn === -1) {
            history.replace(Navigation.Lobby);
        }
    }, [turn]);
    if (myId === null) return <Fragment/>;
    return (
        <div className={`${classes.container} ${gc.panelBackground}`}>
            <HorizontalLayout>
                <VerticalLayout className={`${classes.leftPanel}`}>
                    <PlayerBoard/>
                    <MyBoard/>
                </VerticalLayout>
                <VerticalLayout className={`${classes.centerPanel}`}>
                    <MainTableBoard/>
                    <ActionBoards code={roomCode}/>
                </VerticalLayout>
                <VerticalLayout className={`${classes.rightPanel}`}>
                    <GameDeckBoard expansion={ctx.room.header.settings.expansion}/>
                    <InGameChatBoard/>
                </VerticalLayout>
            </HorizontalLayout>
        </div>
    );
}
