import classes from "pages/ingame/InGame.module.css";
import ImagePage from "pages/components/ui/ImagePage/ImagePage";
import {Images} from "resources/Resources";
import {useContext, useEffect} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {useHistory} from "react-router-dom";
import {TurnManager} from "system/GameStates/TurnManager";
import GameOverPopUp from "pages/components/ui/PopUp/PopUp";
import {forceSetTimer} from "pages/components/ui/MyTimer/MyTimer";
import {WaitTime} from "system/GameConstants";
import TransitionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {Navigation} from "App";

export default function GameOverPage() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();
    const amHost = TurnManager.amHost(ctx, localCtx);
    useEffect(() => {
        forceSetTimer(localCtx, WaitTime.WaitReactions, () => {
            if (!amHost) return;
            TransitionManager.pushLobby(ctx.room.header.games);
        });
    }, [amHost]);
    useEffect(() => {
        if (ctx.room.game.state.turn === -1) {
            history.replace(Navigation.Lobby);
        }
    }, [ctx.room.game.state.turn]);

    return <div className={classes.container}>
        <GameOverPopUp/>
        <ImagePage imgSrc={Images.LoadingImg}/>;
    </div>;
}