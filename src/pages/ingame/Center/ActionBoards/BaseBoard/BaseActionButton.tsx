import { IProps } from "system/types/CommonTypes";
import { ActionType } from "system/GameStates/States";
import classes from "./BaseBoard.module.css";

type Prop = IProps & {
  actionType: ActionType;
};
export default function BaseActionButton(props: Prop) {
  return (
    <button
      className={`${classes.cell} ${props.className}`}
      onClick={() => {
        console.log(`Clicked ${props.actionType} `);
      }}
    >
      Action
    </button>
  );
}
