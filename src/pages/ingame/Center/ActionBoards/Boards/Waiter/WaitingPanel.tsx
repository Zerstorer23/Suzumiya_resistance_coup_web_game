import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoard.module.css";
import {useContext} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {useTranslation} from "react-i18next";
import {formatInsert} from "lang/i18nHelper";

export default function WaitingPanel() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const currId = TurnManager.getCurrentPlayerId(ctx);
    const isMyTurn: boolean = TurnManager.isMyTurn(ctx, localCtx);
    const {t} = useTranslation();
    if (isMyTurn) {
        return (
            <div className={classes.singleContainer}>
                <h1>{t("_waiting_others")}</h1>
            </div>
        );
    } else {
        return (
            <div className={classes.singleContainer}>
                <h1>
                    {formatInsert(t, "_waiting_other_player", ctx.room.playerMap.get(currId)?.name)}
                </h1>
            </div>
        );
    }
};

