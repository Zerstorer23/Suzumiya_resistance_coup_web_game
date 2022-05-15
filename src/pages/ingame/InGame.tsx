import HorizontalLayout from "../components/ui/HorizontalLayout";
import VerticalLayout from "../components/ui/VerticalLayout";
import classes from "./InGame.module.css";
import gc from "../../global.module.css";
import PlayerBoard from "./Left/PlayerBoard/PlayerBoard";
import MyBoard from "./Left/MyBoard/MyBoard";
import MainTableBoard from "./Center/MainTableBoard/MainTableBoard";
import ActionBoards from "./Center/ActionBoards/ActionBoards";
import GameDeckBoard from "./Right/GameDeckBoard/GameDeckBoard";
import InGameChatBoard from "./Right/ChatBoard/InGameChatBoard";

export default function InGame() {
  return (
    <div className={classes.container}>
      <HorizontalLayout>
        <VerticalLayout className={`${gc.flex1}`}>
          <PlayerBoard />
          <MyBoard />
        </VerticalLayout>
        <VerticalLayout className={`${gc.flex2}`}>
          <MainTableBoard />
          <ActionBoards />
        </VerticalLayout>
        <VerticalLayout className={`${gc.flex1}`}>
          <GameDeckBoard />
          <InGameChatBoard />
        </VerticalLayout>
      </HorizontalLayout>
    </div>
  );
}
