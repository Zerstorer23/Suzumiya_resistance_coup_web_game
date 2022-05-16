import BaseActionButton from "pages/ingame/Center/ActionBoards/BaseBoard/BaseActionButton";
import {
  ActionType,
  BoardState,
  getActionsFromState,
} from "system/GameStates/States";
import classes from "./BaseBoard.module.css";

export default function BaseBoard(): JSX.Element {
  //TODO change by board state
  const actions = getActionsFromState(BoardState.MyTurn);

  return (
    <div className={classes.container}>
      {actions.map((action: ActionType, index: number) => {
        const baseIndex = index + 1;
        const cssName = classes[`cell${baseIndex}`];
        return (
          <BaseActionButton
            key={index}
            className={`${cssName}`}
            actionType={action}
          />
        );
      })}
    </div>
  );
}
