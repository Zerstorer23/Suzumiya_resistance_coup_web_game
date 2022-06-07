import classes from "./PlayersPanel.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import PlayerListItem from "./PlayerListItem";
import {PlayerMap} from "system/GameStates/GameTypes";
import {useContext, useRef} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {setStartingRoom} from "system/GameStates/RoomGenerator";
import gc from "global.module.css";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import useKeyListener, {KeyCode} from "system/hooks/useKeyListener";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";
import {useTranslation} from "react-i18next";
import {insert} from "lang/i18nHelper";


export default function PlayersPanel() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const amHost = TurnManager.amHost(ctx, localCtx);
    const startBtnRef = useRef<HTMLButtonElement>(null);
    const playerMap: PlayerMap = ctx.room.playerMap;
    const currPlayer = playerMap.size;
    const playerList = ctx.room.playerList;
    const {t} = useTranslation();

    useKeyListener([KeyCode.Space], onKey);

    function onKey(keyCode: KeyCode) {
        if (localCtx.getVal(LocalField.InputFocus) === InputCursor.Chat) return;
        if (keyCode === KeyCode.Space) {
            onClickStart();
        }
    }

    function onClickStart() {
        if (!amHost) return;
        if (ctx.room.playerMap.size <= 1) return;
        const room = ctx.room;
        setStartingRoom(room);
    }

    let buttonKey = (amHost) ? "_start" : "_waiting_at_lobby";
    if (ctx.room.playerMap.size <= 1) buttonKey = "_not_enough_people";


    return (
        <VerticalLayout className={`${gc.round_border} ${classes.container} `}>
            <div className={classes.headerContainer}>
                <p className={classes.headerTitle}>{t("_game_title")}</p>
                <p className={classes.headerPlayerNum}>{insert(t, "_connected", currPlayer)}</p>
            </div>
            <VerticalLayout className={classes.list}>{
                playerList.map((id, index, array) => {
                    return <PlayerListItem key={id} player={playerMap.get(id)!}
                                           isHost={id === ctx.room.header.hostId}/>;
                })
            }</VerticalLayout>
            <button ref={startBtnRef} className={classes.buttonStart} onClick={onClickStart}>
                {t(buttonKey)}
            </button>
        </VerticalLayout>
    );
}
