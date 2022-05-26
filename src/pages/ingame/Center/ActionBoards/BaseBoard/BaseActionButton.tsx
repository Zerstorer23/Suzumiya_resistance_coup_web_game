import { IProps } from "system/types/CommonTypes";
import { ActionType } from "system/GameStates/States";
import classes from "./BaseBoard.module.css";

type Prop = IProps & {
  name: string;
  actionType: ActionType;
  onClickButton: () => {};
};
export default function BaseActionButton(props: Prop) {
  return (
    <button
      className={`${classes.cell} ${props.className}`}
      onClick={props.onClickButton}
    >
      {props.name}
    </button>
  );
}
