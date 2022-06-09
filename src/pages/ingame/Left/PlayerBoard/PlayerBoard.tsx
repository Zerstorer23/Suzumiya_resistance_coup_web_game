import {Fragment, useContext} from "react";
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
    return (
        <Fragment>
            <div className={`${gc.round_border} ${classes.container}`}>
                <p className={classes.header}>{t("_players")}</p>
                <div className={classes.playersContainer}>
                    {sortedList.map((playerId) => (
                        <PlayerItem
                            key={playerId}
                            playerId={playerId}
                            player={playerMap.get(playerId)!}
                        />
                    ))}
                </div>
            </div>
        </Fragment>
    );
}
