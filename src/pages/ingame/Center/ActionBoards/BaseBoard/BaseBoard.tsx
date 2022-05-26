import BaseActionButton from "pages/ingame/Center/ActionBoards/BaseBoard/BaseActionButton";
import { ActionInfo } from "system/GameStates/ActionInfo";
import { ActionType } from "system/GameStates/States";
import classes from "./BaseBoard.module.css";

export default function BaseBoard(): JSX.Element {
  //TODO change by board state
  const actions = [
    ActionType.GetOne,
    ActionType.GetThree,
    ActionType.GetForeignAid,
    ActionType.Steal,
    ActionType.Coup,
    ActionType.Assassinate,
    ActionType.None,
    ActionType.ChangeCards,
  ];
  function onMakeAction(action: ActionType) {
    switch (action) {
    }
    console.log(`Clicked ${action}`);
  }
  return (
    <div className={classes.container}>
      {actions.map((action: ActionType, index: number) => {
        const baseIndex = index + 1;
        const cssName = classes[`cell${baseIndex}`];
        return (
          <BaseActionButton
            key={index}
            className={`${cssName}`}
            actionInfo={new ActionInfo(action)}
            onClickButton={() => {
              onMakeAction(action);
            }}
          />
        );
      })}
    </div>
  );
}
