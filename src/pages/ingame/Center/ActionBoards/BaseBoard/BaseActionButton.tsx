import { IProps } from "system/types/CommonTypes";
import { ActionType } from "system/GameStates/States";
import classes from "./BaseBoard.module.css";
import { ActionInfo } from "system/GameStates/ActionInfo";
import { Fragment } from "react";
import { Card } from "system/cards/Card";

type Prop = IProps & {
  actionInfo?: ActionInfo;
  cardInfo?: Card;
  onClickButton: () => void;
};
export default function BaseActionButton(props: Prop) {
  const action = props.actionInfo;
  if (action?.actionType === ActionType.None) {
    return <Fragment />;
  }
  let name = action?.getName();
  if (action === null) {
    name = props.cardInfo?.cardRole;
  }
  return (
    <button
      className={`${classes.cell} ${props.className}`}
      onClick={props.onClickButton}
    >
      {name}
    </button>
  );
}
