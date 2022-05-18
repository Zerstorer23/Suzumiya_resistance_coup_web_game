import { useEffect, useState } from "react";
import gc from "global.module.css";
import { ItemPair } from "system/types/CommonTypes";
import Dropdown from "pages/components/ui/Dropdown";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./LobbySettings.module.css";
import { firebase, db } from "system/Database/Firebase";

export const networkOptions: ItemPair[] = [
  { key: "1", label: "Normal", value: "100" },
  { key: "2", label: "Slow", value: "500" },
];
export default function LobbySettings() {
  const [networkCondition, setNetworkCondition] = useState("100");
  const [playerName, setPlayerName] = useState("ㅇㅇ");
  const [playerId, setPlayerId] = useState("null");
  var nameRef: firebase.database.Reference;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onInitDB =
    // useCallback(
    async () => {
      if (playerId === "null") {
        const playerNameRef = db.ref("players");
        nameRef = await playerNameRef.push();
        const a = nameRef.key;
        setPlayerId(a!);
      } else {
        nameRef = db.ref(`players/${playerId}`);
      }
      nameRef.onDisconnect().remove();
      nameRef.on("value", (snapshot) => {
        const data = snapshot.val();
        console.log(data);
      });
    };
  // , []);

  useEffect(() => {
    // onInitDB();
  }, [onInitDB]);

  const onChangeNetworkCondition = (event: any) => {
    console.log(event.target.value);
    setNetworkCondition(event.target.value.value);
  };
  //TODO useEffect to listen to change.
  function onChangeName(event: any) {
    setPlayerName(event.target.value);
  }

  async function onFinishEditName(event: any) {
    console.log(event.target.value);
    if (nameRef != null) console.log(nameRef.key);
    await nameRef.update({
      name: playerName,
    });
    console.log("Updated name ");
  }

  return (
    <div className={`${classes.container} ${gc.round_border}`}>
      <HorizontalLayout>
        <p>Name</p>
        <input
          className={classes.inputName}
          type="text"
          onChange={onChangeName}
          onBlur={onFinishEditName}
          value={playerName}
        ></input>
      </HorizontalLayout>
      <HorizontalLayout>
        <p>Net ping</p>
        <Dropdown
          className={classes.pingDropdown}
          label={null}
          options={networkOptions}
          value={networkCondition}
          onChange={onChangeNetworkCondition}
        />
      </HorizontalLayout>
      <button className={classes.helpButton}>Help</button>
      <button className={classes.helpButton}>Settings</button>
    </div>
  );
}
