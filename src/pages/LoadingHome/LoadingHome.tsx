import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PlayersContext from "system/context/room-context";
import { db } from "system/Database/Firebase";
import { joinLobby, loadRoom, setUpGame } from "system/Database/RoomDatabase";
import { PAGE_LOBBY } from "system/GameStates/States";

export default function LoadingHome() {
  const history = useHistory();
  //Load Players

  function setUpRoom() {
    setUpGame();
  }
  function spectateJoin() {}
  function playerJoin() {
    joinLobby();
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadRoom((data) => {
      if (data === null) {
        //set up room
        setUpRoom();
      } else {
        console.log(data);
        if (data.playerList.length === 0) {
          //Join as host
          setUpRoom();
        } else if (data.game.currentTurn < 0) {
          //Spectate
          spectateJoin();
        } else {
          //just join
          playerJoin();
        }
      }
      history.replace(PAGE_LOBBY);
    });
  }, []);

  return <h1>Connecting...</h1>;
}
