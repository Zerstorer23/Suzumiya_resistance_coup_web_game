import HorizontalLayout from "../components/ui/HorizontalLayout";
import VerticalLayout from "../components/ui/VerticalLayout";
import classes from "./InGame.module.css";
import PlayerBoard from "./Left/PlayerBoard/PlayerBoard";
import MyBoard from "./Left/MyBoard/MyBoard";
import MainTableBoard from "./Center/MainTableBoard/MainTableBoard";
import ActionBoards from "./Center/ActionBoards/ActionBoards";
import GameDeckBoard from "./Right/GameDeckBoard/GameDeckBoard";
import InGameChatBoard from "./Right/ChatBoard/InGameChatBoard";
import { useContext, useEffect, useState } from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import { useHistory } from "react-router-dom";
import { DbReferences, ReferenceManager } from "system/Database/RoomDatabase";
import GameOverPopUp from "pages/components/ui/PopUp/PopUp";
import { Navigation } from "App";
import { TurnManager } from "system/GameStates/TurnManager";
import { setMyTimer } from "pages/components/ui/MyTimer/MyTimer";
import { WaitTime } from "system/GameConstants";
import { TurnState } from "system/GameStates/GameTypes";

export default function InGame() {
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const history = useHistory();
  const myId = localCtx.getVal(LocalField.Id);
  const [roomCode, setRoomCode] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const amHost = TurnManager.amHost(ctx, localCtx);

  function checkSanity() {
    if (myId === ctx.room.header.hostId) {
      ReferenceManager.updateReference(
        DbReferences.GAME_action,
        ctx.room.game.action
      );
      ReferenceManager.updateReference(
        DbReferences.GAME_state,
        ctx.room.game.state
      );
      ReferenceManager.updateReference(DbReferences.HEADER_hostId, myId);
    }
  }

  useEffect(() => {
    checkSanity();
    setRoomCode((n) => n++);
  }, [ctx.room.playerMap.size]);

  useEffect(() => {
    if (myId === null) {
      history.replace(Navigation.Loading);
    }
  }, [myId, history]);
  const turn = ctx.room.game.state.turn;
  useEffect(() => {
    if (turn === -2) {
      setIsGameOver(true);
      //Set timer 5 sec,
      //If I am host,  change turn on expire
      setMyTimer(localCtx, WaitTime.WaitReactions, () => {
        if (amHost) {
          const state: TurnState = {
            turn: -1,
            board: 0,
          };
          ReferenceManager.updateReference(DbReferences.GAME_state, state);
        }
      });
    } else if (turn === -1) {
      setIsGameOver(false);
      history.replace(Navigation.Lobby);
    }
  }, [turn]);

  if (myId === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.container}>
      {isGameOver && <GameOverPopUp />}
      <HorizontalLayout>
        <VerticalLayout className={`${classes.leftPanel}`}>
          <PlayerBoard />
          <MyBoard />
        </VerticalLayout>
        <VerticalLayout className={`${classes.centerPanel}`}>
          <MainTableBoard />
          <ActionBoards code={roomCode} />
        </VerticalLayout>
        <VerticalLayout className={`${classes.rightPanel}`}>
          <GameDeckBoard />
          <InGameChatBoard />
        </VerticalLayout>
      </HorizontalLayout>
    </div>
  );
}
