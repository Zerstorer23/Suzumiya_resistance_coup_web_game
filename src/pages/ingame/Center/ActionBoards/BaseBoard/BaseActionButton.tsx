import { IProps } from "system/types/CommonTypes";
import { ActionType } from "system/GameStates/States";
import classes from "./BaseBoard.module.css";
import { ActionInfo } from "system/GameStates/ActionInfo";

type Prop = IProps & {
  actionInfo: ActionInfo;
  onClickButton: () => void;
};
export default function BaseActionButton(props: Prop) {
  return (
    <button
      className={`${classes.cell} ${props.className}`}
      onClick={props.onClickButton}
    >
      {props.actionInfo.getName()}
    </button>
  );
}
