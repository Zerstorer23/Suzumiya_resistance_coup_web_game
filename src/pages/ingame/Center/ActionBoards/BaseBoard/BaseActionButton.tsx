import { IProps } from "system/types/CommonTypes";
import { ActionType } from "system/GameStates/States";
import classes from "./BaseBoard.module.css";
import { ActionInfo } from "system/GameStates/ActionInfo";
import { Fragment } from "react";
import { Card } from "system/cards/Card";
import IMG_NAGATO from "resources/images/nagato2.png";

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
      <div>{/* <img src={IMG_NAGATO} alt="d" /> */}</div>
      <p>{name}</p>
      <p>{/* [Lie] */}</p>
    </button>
  );
}
