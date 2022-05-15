import React, { Fragment } from "react";
import { IProps } from "../../../App";
import classes from "./PlayerListItem.module.css";
import gc from "../../../global.module.css";

type Prop = IProps & {
  value: any;
};

export default function PlayerListItem(props: Prop) {
  return <div className={classes.item}>{props.value}</div>;
}
