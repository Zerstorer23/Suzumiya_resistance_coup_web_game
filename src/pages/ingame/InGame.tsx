import HorizontalLayout from "../components/ui/HorizontalLayout";
import VerticalLayout from "../components/ui/VerticalLayout";
import classes from "./InGame.module.css";
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
import GameOverPopUp from "pages/components/ui/PopUp/PopUp";
import {Navigation} from "App";
import {TurnManager} from "system/GameStates/TurnManager";
import {forceSetTimer} from "pages/components/ui/MyTimer/MyTimer";
import {TurnState} from "system/GameStates/GameTypes";
import {DS} from "system/Debugger/DS";
import ImagePage from "pages/components/ui/ImagePage/ImagePage";
import {Images} from "resources/Resources";
import {WaitTime} from "system/GameConstants";
import {DeckManager} from "system/cards/DeckManager";
import {DbReferences, ReferenceManager} from "system/Database/ReferenceManager";
import TransitionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";

export default function InGame() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();
    const myId = localCtx.getVal(LocalField.Id);
    const [roomCode, setRoomCode] = useState<number>(0);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const amHost = TurnManager.amHost(ctx, localCtx);

    function checkSanity(): boolean {
        if (!amHost) return false;
        ReferenceManager.updateReference(
            DbReferences.GAME_action,
            ctx.room.game.action
        );
        ReferenceManager.updateReference(
            DbReferences.GAME_state,
            ctx.room.game.state
        );
        ReferenceManager.updateReference(DbReferences.HEADER_hostId, myId);
        const alive = DeckManager.countAlivePlayers(ctx);
        if (!DS.StrictRules || alive > 1) return true;
        setIsGameOver(true);
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
            setIsGameOver(true);
            forceSetTimer(localCtx, WaitTime.WaitReactions, () => {
                if (!amHost) return;
                const state: TurnState = {turn: -1, board: 0,};
                ReferenceManager.updateReference(DbReferences.GAME_state, state);
            });
        } else if (turn === -1) {
            setIsGameOver(false);
            history.replace(Navigation.Lobby);
        }
    }, [turn]);

    if (myId === null) {
        return <ImagePage imgSrc={Images.LoadingImg}/>;
    }
    if (isGameOver) {
        return <div className={classes.container}>
            <GameOverPopUp/>
            <ImagePage imgSrc={Images.LoadingImg}/>;
        </div>;
    }
    return (
        <div className={classes.container}>
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
                    <GameDeckBoard/>
                    <InGameChatBoard/>
                </VerticalLayout>
            </HorizontalLayout>
        </div>
    );
}
