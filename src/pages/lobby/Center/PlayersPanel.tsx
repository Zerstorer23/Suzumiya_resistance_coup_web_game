import classes from "./PlayersPanel.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import PlayerListItem from "./PlayerListItem";
import {Player, PlayerMap} from "system/GameStates/GameTypes";
import {Fragment, useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {setStartingRoom} from "system/GameStates/RoomGenerator";
import gc from "global.module.css";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import useKeyListener, {KeyCode} from "system/hooks/useKeyListener";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";
import {useTranslation} from "react-i18next";
import {formatInsert, insert} from "lang/i18nHelper";
import {DbReferences, ReferenceManager} from "system/Database/ReferenceManager";


export default function PlayersPanel() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const amHost = TurnManager.amHost(ctx, localCtx);
    const playerMap: PlayerMap = ctx.room.playerMap;
    const currPlayer = playerMap.size;
    const playerList = ctx.room.playerList;
    const {t} = useTranslation();

    useKeyListener([KeyCode.Space], onKey);
    if (myPlayer === undefined || myPlayer === null) return <Fragment/>;

    function onKey(keyCode: KeyCode) {
        if (localCtx.getVal(LocalField.InputFocus) === InputCursor.Chat) return;
        if (keyCode === KeyCode.Space) {
            onClickStart();
        }
    }

    function onClickStart() {
        if (amHost) {
            //Host action is start game
            if (playerList.length <= 1) return;
            if (!canStartGame(playerMap)) return;
            const room = ctx.room;
            setStartingRoom(room);
        } else {
            //My action is ready
            const toggleReady = !myPlayer.isReady;
            const ref = ReferenceManager.getPlayerFieldReference(myId, DbReferences.PLAYER_isReady);
            ref.set(toggleReady);
        }
    }

    let buttonKey = getButtonKey(amHost, playerList, playerMap, myPlayer);
    const numGames = ctx.room.header.games;
    const remainingCss = getRemainingCss(numGames);
    return (
        <VerticalLayout className={`${gc.round_border} ${classes.container} `}>
            <div className={classes.headerContainer}>
                <p className={classes.headerTitle}>{t("_game_title")}</p>
                <p className={classes.headerPlayerNum}>{insert(t, "_connected", currPlayer)}</p>
            </div>
            <VerticalLayout className={classes.list}>{
                playerList.map((id, index, array) => {
                    const player = playerMap.get(id)!;
                    return <PlayerListItem key={id} player={player}
                                           isHost={id === ctx.room.header.hostId}/>;
                })
            }</VerticalLayout>
            <div className={classes.bottomPanel}>
                <div className={`${classes.remainingGames} ${remainingCss}`}>
                    <p>
                        {formatInsert(t, "_games_remaining", numGames)}
                    </p>
                </div>
                {
                    (numGames > 0) ?
                        <button className={classes.buttonStart} onClick={onClickStart}>
                            {t(buttonKey)}
                        </button> :
                        <p className={classes.noMoreCoins}>
                            {amHost ? t("_prompt_how_to") : t("_prompt_play_more_want")}
                        </p>
                }
            </div>
        </VerticalLayout>
    );
}

function canStartGame(playerMap: PlayerMap) {
    const numReady = countReadyPlayers(playerMap);
    return numReady >= (playerMap.size - 1);
}

function countReadyPlayers(playerMap: PlayerMap): number {
    let count = 0;
    playerMap.forEach((player, key, map) => {
        if (player.isReady) count++;
    });
    return count;
}

function getRemainingCss(n: number) {
    if (n > 6) return classes.lightBlue;
    if (n > 3) return classes.lightYellow;
    return classes.lightRed;
}

function getButtonKey(amHost: boolean, playerList: string[], playerMap: Map<string, Player>, myPlayer: Player) {
    if (amHost) {
        if (playerList.length <= 1) {
            return "_not_enough_people";
        } else if (!canStartGame(playerMap)) {
            return "_not_enough_ready";
        } else {
            return "_start";
        }
    } else {
        if (!myPlayer.isReady) {
            return "_on_ready";
        } else {
            return "_waiting_at_lobby";
        }
    }
}
