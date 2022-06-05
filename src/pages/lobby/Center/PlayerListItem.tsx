import React from "react";
import classes from "./PlayerListItem.module.css";
import {Player} from "system/GameStates/GameTypes";
import {IProps} from "system/types/CommonTypes";

type Prop = IProps & {
    player: Player;
    isHost: boolean
};

export default function PlayerListItem(props: Prop) {
    const name = props.player.name;

    return (
        <div className={classes.item}>
            <p className={props.isHost ? classes.isHost : ""}>{name}</p>
        </div>
    );
}
