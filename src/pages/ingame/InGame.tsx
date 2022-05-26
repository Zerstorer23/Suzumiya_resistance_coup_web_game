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
import { useContext, useEffect } from "react";
import RoomContext from "system/context/room-context";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import { useHistory } from "react-router-dom";

export default function InGame() {
  const context = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const history = useHistory();
  const myId = localCtx.getVal(LocalField.Id);
  useEffect(() => {
    console.log(`In game id ${myId}`);
    if (myId === null) {
      history.replace("/");
    }
  }, [myId, history]);
  if (myId === null) {
    return <p>Loading...</p>;
  }

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