import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import { ActionInfo } from "system/GameStates/ActionInfo";
import { ActionType } from "system/GameStates/States";
export default function ForeignAidReactBoard(): JSX.Element {
  //TODO change by board state
  const actions = [ActionType.Accept, ActionType.DukeBlocksForeignAid];

  function onMakeAction(action: ActionType) {}

  return (
    <div className={classes.container}>
      {actions.map((action: ActionType, index: number) => {
        const baseIndex = index + 1;
        const cssName = classes[`cell${baseIndex}`];
        return (
          <BaseActionButton
            key={index}
            className={`${cssName}`}
            param={new ActionInfo(action)}
            onClickButton={() => {
              onMakeAction(action);
            }}
          />
        );
      })}
    </div>
  );
}
