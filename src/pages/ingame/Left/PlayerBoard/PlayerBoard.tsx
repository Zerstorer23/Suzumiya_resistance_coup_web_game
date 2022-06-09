import React, {Fragment, useContext, useEffect, useRef} from "react";
import gc from "global.module.css";
import classes from "./PlayerBoard.module.css";
import PlayerItem from "./PlayerItem/PlayerItem";
import {getSortedListFromMap} from "system/GameStates/RoomGenerator";
import RoomContext from "system/context/roomInfo/room-context";
import {useTranslation} from "react-i18next";
//https://www.npmjs.com/package/react-youtube-background
export default function PlayerBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const playerMap = ctx.room.playerMap;
    const sortedList: string[] = getSortedListFromMap(playerMap);
    const {t} = useTranslation();
    const currPlayerRef = useRef<HTMLDivElement>(null);
    const turn = ctx.room.game.state.turn;
    useEffect(() => {
        if (currPlayerRef.current !== null)
            currPlayerRef.current.scrollIntoView({behavior: "smooth"});
    }, [turn]);
    return (
        <Fragment>
            <div className={`${gc.round_border} ${classes.container}`}>
                <p className={classes.header}>{t("_players")}</p>
                <div className={classes.playersContainer}>
                    {sortedList.map((playerId, index) => {
                            return <Fragment key={playerId}>
                                <PlayerItem
                                    playerId={playerId}
                                    player={playerMap.get(playerId)!}
                                />
                                {(index === turn) && <div ref={currPlayerRef}/>}
                            </Fragment>;
                        }
                    )}
                </div>
            </div>
        </Fragment>
    );
}
