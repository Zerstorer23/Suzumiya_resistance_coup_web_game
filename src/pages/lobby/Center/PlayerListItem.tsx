import React, { Fragment } from "react";
import classes from "./PlayerListItem.module.css";
import { Player } from "system/GameStates/GameTypes";
import { IProps } from "system/types/CommonTypes";

type Prop = IProps & {
  player: Player;
};

export default function PlayerListItem(props: Prop) {
  const name = props.player.name;

  return (
    <div className={classes.item}>
      <p>{name}</p>
    </div>
  );
}
